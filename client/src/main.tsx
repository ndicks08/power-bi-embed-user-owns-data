// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './msalConfig';

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize().then(() => {
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