const cors = require("cors");
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

const WORKSPACE_ID = process.env.WORKSPACE_ID;
const REPORT_ID = process.env.REPORT_ID;

app.post('/api/embed-token', async (req, res) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(400).json({ error: 'Missing access token from frontend' });
    }

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

        const embedToken = response.data.token;

        const reportDetails = await axios.get(
            `https://api.powerbi.com/v1.0/myorg/groups/${WORKSPACE_ID}/reports/${REPORT_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const embedUrl = reportDetails.data.embedUrl;

        res.json({ embedToken, embedUrl, reportId: REPORT_ID });
    } catch (error) {
        console.error('Power BI embed token generation failed:', error.response?.data || error.message);
        res.status(500).json({ error: 'Embed token generation failed' });
    }
});

app.listen(process.env.PORT || 3001, () => {
    console.log('Backend running on port 3001');
});