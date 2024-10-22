const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const RECAPTCHA_SECRET_KEY = '6Lc_52gqAAAAAEjchP9vx5hN3nZyDHyvPHU-Bg1p';

// Serve the HTML file on the root route "/"
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');  // Assuming your HTML file is named index.html
});

// Route to verify reCAPTCHA
app.post('/verify-recaptcha', async (req, res) => {
    const recaptchaResponse = req.body.recaptchaToken;

    if (!recaptchaResponse) {
        return res.status(400).json({ message: 'reCAPTCHA token is missing.' });
    }

    // Verify reCAPTCHA token with Google's API
    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: RECAPTCHA_SECRET_KEY,
                response: recaptchaResponse
            }
        });

        const { success } = response.data;

        if (success) {
            res.json({ message: 'reCAPTCHA verified successfully.' });
        } else {
            res.status(400).json({ message: 'reCAPTCHA verification failed.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying reCAPTCHA.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
