import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

interface Goat {
	id: number;
	lastname: string;
	firstname: string;
	born_at: number;
	email: string;
	password: string;
	picture: string;
	presentation: string;
	video: string | null;
}

class goatRepository {
	async read(id: number) {
		const [[goat]] = await databaseClient.query<Rows>(
			"SELECT * FROM goat WHERE id = ?",
			[id],
		);

		return goat;
	}

	async createGoat(goat: Goat) {
		const [result] = await databaseClient.query<Result>(
			"INSERT INTO goat (lastname, firstname, born_at, email, password, picture, presentation, video) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			[
				goat.lastname,
				goat.firstname,
				goat.born_at,
				goat.email,
				goat.password,
				goat.picture,
				goat.presentation,
				goat.video,
			],
		);
		return result.insertId;
	}

	async readUserByEmail(email: string) {
		return databaseClient.query<Rows>("SELECT * From goat WHERE email = ?", [
			email,
		]);
	}
}

export default new goatRepository();
