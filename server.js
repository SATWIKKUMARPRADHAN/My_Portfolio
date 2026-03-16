const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/sendmail", async (req, res) => {

    const { name, email, message } = req.body;

    console.log("Incoming request:", req.body);

    if (!name || !email || !message) {
        return res.status(400).send("error");
    }

    try {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.verify();
        console.log("SMTP server ready");

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Portfolio Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
        });

        console.log("Email sent successfully");

        res.send("success");

    } catch (error) {

        console.error("Mail error:", error);

        res.status(500).send("error");

    }

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});