const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint pour l'envoi d'emails
app.post('/send-email', async (req, res) => {
    const { email, recipientName, receiverName, packageCount } = req.body;

    // Vérifier que tous les champs requis sont remplis
    if (!email || !recipientName || !receiverName || !packageCount) {
        return res.status(400).send('Tous les champs sont requis.');
    }

    try {
        // Configurer le transporteur Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Adresse email de l'expéditeur
                pass: process.env.GMAIL_PASS, // Mot de passe de l'application
            },
        });

        // Configurer les options de l'email
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Confirmation de réception de colis',
            text: `Bonjour ${recipientName},

Voici les détails de votre colis :

Nom du réceptionnaire : ${receiverName}
Nombre de colis : ${packageCount}

Merci de votre confiance.

Cordialement,
L'équipe de gestion de colis`,
        };

        // Envoyer l'email
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email envoyé avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        res.status(500).send('Erreur lors de l\'envoi de l\'email.');
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
