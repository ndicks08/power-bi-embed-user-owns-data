// imports need to make this app run
import React, { useState } from 'react';
import axios from 'axios';

// gives access to authentication instance
import { useMsal } from '@azure/msal-react';
// holds login scopes and authority from the msal (microsoft authentication library) config
import { loginRequest } from './msalConfig';
// react wrapper fro pwoer bi js sdk
import { PowerBIEmbed } from 'powerbi-client-react';
// power bi constants/enums
import { models, type IEmbedConfiguration, Embed } from 'powerbi-client';
// css styling
import './App.css'

/* defines the structure response from the backend 
* when it returns the power bi credentials */
interface EmbedTokenResponse {
    embedToken: string;
    embedUrl: string;
    reportId: string;
}

// creates react componenet
const App: React.FC = () => {
    // get the msal instance for login and token management
    const { instance } = useMsal();
    //power bi configuration
    const [embedConfig, setEmbedConfig] = useState<IEmbedConfiguration | null>(null);
    // function that trigger microsoft login request
    const signInAndLoadReport = async () => {
            try {
                // creates the popup for logging in
                const loginResponse = await instance.loginPopup(loginRequest);
                
                // set the account
                instance.setActiveAccount(loginResponse.account);
                
                // check msal cache to see if account is included (is a valid account)
                const accountResponse = instance.getAccount(loginResponse.account);
                if (!accountResponse){ console.error("no account found"); return;}
                
                // use msal to get access token to call backend securely
                const response = await instance.acquireTokenSilent({
                    ...loginRequest,
                    account: loginResponse.account,
                });
                const accessToken = response.accessToken;

                //pass in the access token to the backend to 1) authenticate user 2) generate the embed token need to embed report
                const embedRes = await axios.post<EmbedTokenResponse>(
                    'http://localhost:3001/api/embed-token',
                    {accessToken}
                );
                
                // backend returns the embedToken, embedUrl, and reportId, all needed in PowerBIEmbed Tag
                const {embedToken, embedUrl, reportId} = embedRes.data;

                // set the configuration need for PowerBIEmbed
                //settings for embed itself (cna be altered easily)
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

    //login in button that calls function to validate user is authenticated
    if (!embedConfig) return (
        <div>
            <button onClick={signInAndLoadReport}>Login</button>
        </div>
    );

    /* If embedConfig is set up simply returns the embed report itself
    PowerBIEmbed is wrapper that renders and handles an iframe */
    return (
        <div id="reportContainer" className="full-page-report" style={{ width: '100vw', height: '100vh' }}>
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