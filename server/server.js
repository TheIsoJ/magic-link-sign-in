require("dotenv").config()

const express = require("express")
const jwt = require("jsonwebtoken")

const { sendMagicLinkEmail } = require("./mailer")

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const USERS = [
    {
        id: 1,
        name: "Jesse",
        email: "juiceneblueyt@gmail.com"
    }
]

app.post("/login", async (req, res) => {
    const user = USERS.find(u => u.email === req.body.email)

    if (user != null) {
        try {
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: "1h"
            })
            await sendMagicLinkEmail({ email: user.email, token }) 
        } catch (e) {
            return res.send("Virhe kirjautumisessa! Yritä uudestaan!")
        }
    }

    res.send("Tarkista sähköpostisi jatkaaksesi.")
})

app.get("/verify", (req, res) => {
    const token = req.query.token
    if (token == null) return res.sendStatus(401)

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = USERS.find(u => u.id === decodedToken.userId)
        res.send(`Kirjauduttu käyttäjänä: ${user.name}`)
    } catch (e) {
        res.sendStatus(401)
    }
})

app.listen(3000)