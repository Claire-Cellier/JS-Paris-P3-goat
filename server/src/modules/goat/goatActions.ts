import type { RequestHandler } from "express";
import goatRepository from "./goatRepository";

const read: RequestHandler = async (req, res, next) => {
	try {
		const goatId = Number(req.params.id);
		const goat = await goatRepository.read(goatId);
		if (goat == null) {
			res.sendStatus(404);
		} else {
			res.json(goat);
		}
	} catch (err) {
		next(err);
	}
};

const add: RequestHandler = async (req, res, next) => {
	try {
		const files = req.files as Express.Multer.File[] | undefined;
		if (!files || files.length === 0 || !files[0]) {
			res.status(400).json({ error: "Picture is required" });
			return;
		}

		const newGoat = {
			id: req.body.id,
			lastname: req.body.lastname,
			firstname: req.body.firstname,
			born_at: req.body.born_at,
			email: req.body.email,
			password: req.body.password,
			picture: files[0].filename,
			presentation: req.body.presentation,
			video: files[1] ? files[1].filename : null,
		};
		const insertId = await goatRepository.createGoat(newGoat);
		res.status(201).json({ insertId });
		return;
	} catch (err) {
		next(err);
	}
};

export default { read, add };
