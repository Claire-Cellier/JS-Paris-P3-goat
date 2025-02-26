import supertest from "supertest";

import app from "../../src/app";

import databaseClient from "../../database/client";

import type { Result, Rows } from "../../database/client";

afterEach(() => {
	jest.resetAllMocks();
});

describe("GET /api/adverts", () => {
	it("should fetch adverts successefully", async () => {
		const rows = [] as Rows;
		jest
			.spyOn(databaseClient, "query")
			.mockImplementation(async () => [rows, []]);

		const response = await supertest(app).get("/api/adverts");

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual(rows);
	});
});

describe("POST /api/adverts", () => {
	it("should add a new advert successfully", async () => {
		const result = { insertId: 1 } as Result;

		jest
			.spyOn(databaseClient, "query")
			.mockImplementation(async () => [result, []]);

		const fakeAdvert = {
			description: "blablablabla",
			goat_id: 5,
			main_tag_id: 2,
			sub_tag_id: 10,
			id: 1,
		};

		const response = await supertest(app).post("/api/adverts").send(fakeAdvert);

		expect(response.status).toBe(201);
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body.insertId).toBe(result.insertId);
	});

	it("should fail on invalid request body", async () => {
		const result = { insertId: 1 } as Result;

		jest
			.spyOn(databaseClient, "query")
			.mockImplementation(async () => [result, []]);

		const fakeAdvert = {
			description: "blablablabla",
			goat_id: 5,
			main_tag_id: 2,
		};

		const response = await supertest(app).post("/api/adverts").send(fakeAdvert);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({});
	});
});
