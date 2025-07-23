//imports needed
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// MSAL class used to manage authentication
import { PublicClientApplication } from '@azure/msal-browser';
// injects MSAL instance into component tree
import { MsalProvider } from '@azure/msal-react';
// azure ad app registration configuration
import { msalConfig } from './msalConfig';


// creates a MSAL instance using the configuration set up in the msalconfig file
const msalInstance = new PublicClientApplication(msalConfig);

// initialize msal before rendering app
msalInstance.initialize().then(() => {
    // render react app - app wrapped with MsalProvider
    const root = createRoot(document.getElementById('root')!);
    root.render(
        <StrictMode>
            <MsalProvider instance={msalInstance}>
                <App />
            </MsalProvider>
        </StrictMode>
    );
}).catch(error => {
    console.error("MSAL initialization failed:", error);
});