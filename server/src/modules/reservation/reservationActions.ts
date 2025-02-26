import type { NextFunction, Request, Response } from "express";
import { sendConfirmationEmail } from "../../modules/reservation/emailService";

interface CorrectReservationData {
	start_at: string;
	meet_link: string;
	duration: number;
	first_name: string;
	date: string;
	time: string;
	guests: number;
}

interface ReservationRequest extends Request {
	body: {
		email: string;
		reservation: CorrectReservationData;
	};
}

interface ReservationResponse extends Response {}

interface ConfirmReservationRequest extends ReservationRequest {}
interface ConfirmReservationResponse extends ReservationResponse {}
interface ConfirmReservationNextFunction extends NextFunction {}

const confirmReservation = async (
	req: ConfirmReservationRequest,
	res: ConfirmReservationResponse,
	next: ConfirmReservationNextFunction,
): Promise<void> => {
	try {
		const { email, reservation } = req.body;

		if (!email || !reservation) {
			res.status(400).json({ message: "Données manquantes" });
			return;
		}

		await sendConfirmationEmail(email, reservation);
		res.status(200).json({ message: "Email de confirmation envoyé" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de l'envoi de l'email", error });
	}
};

export default confirmReservation;
