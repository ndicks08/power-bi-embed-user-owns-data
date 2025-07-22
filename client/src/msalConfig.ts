// src/msalConfig.ts
import type {Configuration} from '@azure/msal-browser';

export const msalConfig: Configuration = {
    auth: {
        clientId: 'd103be7b-954a-475f-ae1e-8315bd0c7f93',
        authority: 'https://login.microsoftonline.com/37b2b7e6-e1ea-428f-a73f-61cd03f2f6e6',
        redirectUri: 'http://localhost:5173',
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
    },
};

export const loginRequest = {
    scopes: ['https://analysis.windows.net/powerbi/api/.default'],
};