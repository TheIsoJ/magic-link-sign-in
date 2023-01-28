const sendGridMailer = require("@sendgrid/mail")
sendGridMailer.setApiKey(process.env.SENDGRID_API_KEY)

function sendMagicLinkEmail({ email, token }) {
    return sendGridMailer.send({
        to: email,
        from: process.env.FROM_EMAIL,
        subject: "Viimeistele kirjautuminen",
        html: `<a href="http://localhost:3000/verify?token=${token}">Kirjaudu sisään</a>`
    })
}

module.exports = {
    sendMagicLinkEmail
}