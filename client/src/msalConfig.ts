// import msal configuration
import type {Configuration} from '@azure/msal-browser';

//msal configuration object
export const msalConfig: Configuration = {
    auth: {
        //azure ad app registration client id
        clientId: 'd103be7b-954a-475f-ae1e-8315bd0c7f93',
        // restricts authentication for people inside of this azure ad tenant (jobscope)
        // this will likely change
        authority: 'https://login.microsoftonline.com/37b2b7e6-e1ea-428f-a73f-61cd03f2f6e6',
        // where the suer is sent after login in (matches the redirect url in azure app registration)
        redirectUri: 'http://localhost:5173',
    },
    cache: {
        // saves tokens and session data in localStorage instead of sessionStorage
        cacheLocation: 'localStorage',
        // prevents auth state from being stored in cookies
        storeAuthStateInCookie: false,
    },
};

/* this tells the msal to go request access to the pwoer bi api on behalf of the user
* .default scope uses app registrations permissions (these are set in azure ad portal
* in app registration permission) these permissions are delegated (per user)*/
export const loginRequest = {
    scopes: ['https://analysis.windows.net/powerbi/api/.default'],
};