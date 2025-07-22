import React, { useState } from 'react';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './msalConfig';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models, type IEmbedConfiguration, Embed } from 'powerbi-client';

interface EmbedTokenResponse {
    embedToken: string;
    embedUrl: string;
    reportId: string;
}

const App: React.FC = () => {
    const { instance } = useMsal();
    const [embedConfig, setEmbedConfig] = useState<IEmbedConfiguration | null>(null);
    const signInAndLoadReport = async () => {
            try {
                const loginResponse = await instance.loginPopup(loginRequest);
                instance.setActiveAccount(loginResponse.account);
                const accountResponse = instance.getAccount(loginResponse.account);
                if (!accountResponse){ console.error("no account found"); return;}
                const response = await instance.acquireTokenSilent({
                    ...loginRequest,
                    account: loginResponse.account,
                });

                const accessToken = response.accessToken;

                const embedRes = await axios.post<EmbedTokenResponse>(
                    'http://localhost:3001/api/embed-token',
                    {accessToken}
                );

                const {embedToken, embedUrl, reportId} = embedRes.data;

                setEmbedConfig({
                    type: 'report',
                    id: reportId,
                    embedUrl: embedUrl,
                    accessToken: embedToken,
                    tokenType: models.TokenType.Embed,
                    settings: {
                        panes: {
                            filters: {visible: false},
                            pageNavigation: {visible: false},
                        },
                        background: models.BackgroundType.Transparent,
                    },
                });
            } catch (err) {
                console.error('Login or embed error:', err);
            }
    };

    if (!embedConfig) return (
        <div>
            <button onClick={signInAndLoadReport}>Login</button>
        </div>
    );

    return (
        <div style={{ height: '100vh' }}>
            <PowerBIEmbed
                embedConfig={embedConfig}
                cssClassName="report-style-class"
                getEmbeddedComponent={(embedObject: Embed) =>
                    console.log('Report loaded:', embedObject)
                }
            />
        </div>
    );
};

export default App;