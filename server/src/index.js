// enables cross-origin request from the frontend
const cors = require("cors");

// web server framework
const express = require('express');

// http client to call pwoer bi apis
const axios = require('axios');

// loads env variables
const dotenv = require('dotenv');

const app = express();

dotenv.config();

// middleware
// enables cors so that frontend can communicate with backend
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// parse the incoming json bodys
app.use(express.json());

// get the workspace adn report id from the .env file (keeps secrets out of code)
const WORKSPACE_ID = process.env.WORKSPACE_ID;
const REPORT_ID = process.env.REPORT_ID;

// read access token from request body
app.post('/api/embed-token', async (req, res) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(400).json({ error: 'Missing access token from frontend' });
    }

    // use that access token to authorize a call to Power BIs API
    try {
        const response = await axios.post(
            `https://api.powerbi.com/v1.0/myorg/groups/${WORKSPACE_ID}/reports/${REPORT_ID}/GenerateToken`,
            { accessLevel: 'View' },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // get the embed token from API repsonse
        const embedToken = response.data.token;

        // make another call to the embed url
        const reportDetails = await axios.get(
            `https://api.powerbi.com/v1.0/myorg/groups/${WORKSPACE_ID}/reports/${REPORT_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // get the embed url from API response
        const embedUrl = reportDetails.data.embedUrl;

        // send embedToken, embedUrl, adn reportId back to frontend to use
        res.json({ embedToken, embedUrl, reportId: REPORT_ID });
        
      // error handling
    } catch (error) {
        console.error('Power BI embed token generation failed:', error.response?.data || error.message);
        res.status(500).json({ error: 'Embed token generation failed' });
    }
});

// start the server on port 3001
app.listen(process.env.PORT || 3001, () => {
    console.log('Backend running on port ' + process.env.PORT);
});