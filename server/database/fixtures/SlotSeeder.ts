import AbstractSeeder from "./AbstractSeeder";

class SlotSeeder extends AbstractSeeder {
	constructor() {
		super({ table: "slot", truncate: true });
	}

	run() {
		for (let index = 0; index < 10; index++) {
			const fakeSlot = {
				start_at: this.faker.date.future(),
				duration: this.faker.number.int(),
				meet_link: this.faker.internet.url(),
				comment: this.faker.lorem.sentences(),
				advert_id: this.faker.number.int(),
				goat_id: 1,
			};
		}
	}
}

export default SlotSeeder;
