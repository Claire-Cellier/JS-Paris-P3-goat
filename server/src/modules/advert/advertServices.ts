import type { NextFunction, Request, Response } from "express";

const validateAdvert = (req: Request, res: Response, next: NextFunction) => {
	const advert = req.body;
	if (!advert.main_tag_id || !advert.sub_tag_id || !advert.description) {
		res.status(400).send("Missing required fields");
	} else if (typeof advert.description !== "string") {
		res.status(400).send("Description must be a string");
	} else if (advert.description.length < 5) {
		res.status(400).send("Description is too short");
	} else next();
};

export default { validateAdvert };
