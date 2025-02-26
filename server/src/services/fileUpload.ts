import path from "node:path";
import multer from "multer";

const storage = multer.diskStorage({
	destination: path.join(__dirname, "/../../public/upload"),
	filename: (_, file, cb) => {
		const fileTypes = [
			"image/png",
			"image/jpeg",
			"image/jpg",
			"image/gif",
			"video/mp4",
		];
		if (fileTypes.includes(file.mimetype)) {
			cb(null, `${Date.now()}-${file.originalname}`);
		} else {
			cb(new Error("Invalid file type."), "");
		}
	},
});

export default multer({ storage });
