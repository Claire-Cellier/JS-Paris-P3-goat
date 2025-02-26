import nodemailer from "nodemailer";
import "dotenv/config";

// Configuration du transporteur SMTP Brevo
const transporter = nodemailer.createTransport({
	host: "smtp-relay.brevo.com", // Serveur SMTP Brevo
	port: 587, // Port 587 pour TLS (ou 465 pour SSL)
	auth: {
		user: process.env.BREVO_SMTP_USER, // Ton email Brevo
		pass: process.env.BREVO_SMTP_PASSWORD, // Ton mot de passe SMTP (clé API)
	},
});

// Fonction pour envoyer un e-mail de confirmation
export const sendConfirmationEmail = async (
	userEmail: string,
	reservationData: {
		start_at: string;
		meet_link: string;
		duration: number;
		first_name: string;
	},
) => {
	const mailOptions = {
		from: "goapprendretransmettre@gmail.com", // Expéditeur (doit être un email validé sur Brevo)
		to: userEmail,
		subject: "Confirmation de votre réservation",
		text: `Bonjour: ${reservationData.first_name},
      Votre reservation a bien ete prise en compte. Voici les details:
    📅 Date et heure : ${reservationData.start_at}.
    📎 Lien meet : ${reservationData.meet_link}
    🕒 duree : ${reservationData.duration} heure
      Si vous avez des questions ou si vous devez modifier votre réservation, n’hésitez pas à nous contacter.
      Cordialement, 
      l’equipe GoApprendreTransmettre`,
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email :", error);
	}
};
