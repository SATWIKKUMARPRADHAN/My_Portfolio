const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/sendmail', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).send('error');
    }

    // Configure your SMTP transport (use your own credentials)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'satwik2954kumar@gmail.com', // your Gmail
            pass: 'uzhlezbvhuhfkuva' // use App Password, not your Gmail password
        }
    });

    let mailOptions = {
        from: email,
        to: 'satwik2954kumar@gmail.com',
        subject: 'Portfolio Contact Form Message',
        text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('success');
    } catch (err) {
        res.status(500).send('error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
