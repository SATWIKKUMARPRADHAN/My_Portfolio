const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/sendmail", async (req, res) => {

    const { name, email, message } = req.body;

    try {

        await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: process.env.EMAIL_USER,
            subject: `Portfolio Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
        });

        res.send("success");

    } catch (error) {

        console.error(error);
        res.status(500).send("error");

    }

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});