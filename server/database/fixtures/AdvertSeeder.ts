import AbstractSeeder from "./AbstractSeeder";

class AdvertSeeder extends AbstractSeeder {
	constructor() {
		super({ table: "advert", truncate: true, dependencies: [] });
	}

	run() {
		const tagIds = {
			1: [1, 2, 3, 4, 5, 6, 7],
			2: [8, 9, 10, 11, 12, 13, 14, 15],
			3: [16, 17, 18, 19, 20, 21, 22, 23],
			4: [24, 25, 26, 27, 28, 29, 30],
			5: [31, 32, 33, 34, 35, 36, 37, 38],
			6: [39, 40, 41, 42, 43, 44, 45],
			7: [46, 47, 48, 49, 50, 51, 52],
			8: [53, 54, 55, 56, 57, 58],
			9: [59, 60, 61, 62, 63, 64, 65],
			10: [66, 67, 68, 69, 70],
			11: [71, 72, 73, 74, 75, 76, 77, 79],
			12: [78, 79, 80, 81, 82, 83, 84],
			13: [85, 86, 87, 88, 89, 90, 91, 92],
			14: [93, 94, 95, 96, 97, 98, 99],
			15: [100],
		};

		for (let index = 0; index < 10; index++) {
			const randomMainTagId = Math.floor(Math.random() * 15) + 1;
			const subTagIds = tagIds[randomMainTagId as keyof typeof tagIds];
			const randomSubTagId =
				subTagIds[Math.floor(Math.random() * subTagIds.length)];

			const fakeAdvert = {
				description: this.faker.lorem.sentence(),
				goat_id: index < 5 ? 1 : 2,
				main_tag_id: randomMainTagId,
				sub_tag_id: randomSubTagId,
			};
			this.insert(fakeAdvert);
		}
	}
}

export default AdvertSeeder;
