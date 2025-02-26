import { RowDataPacket } from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

interface MainTag {
	id: number;
	name: string;
}

class mainTagRepository {
	async read(id: number) {
		const [[rows]] = await databaseClient.query<Rows>(
			"SELECT * FROM main_tag WHERE id = ?",
			[id],
		);

		return rows as MainTag;
	}

	async readAll() {
		const [mainTags] = await databaseClient.query<Rows>(
			"SELECT * FROM main_tag",
		);

		return mainTags;
	}
}

export default new mainTagRepository();
