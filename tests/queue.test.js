import request from "supertest";
import {
    beforeEach,
    afterAll,
    describe,
    expect,
    it
} from "vitest";

import app from "../src/app.js";
import db from "../src/config/database.js";

beforeEach(() => {
    db.prepare("DELETE FROM customers").run();
});

describe("Smart Queue API", () => {
    it("should create a new customer", async () => {
        const response = await request(app)
            .post("/api/queue")
            .send({
                name: "Ali"
            });

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe("Ali");
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.status).toBe("Waiting");
    });

    it("should return all waiting customers", async () => {
        await request(app)
            .post("/api/queue")
            .send({
                name: "Ali"
            });

        await request(app)
            .post("/api/queue")
            .send({
                name: "Murad"
            });

        const response = await request(app)
            .get("/api/queue");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].name).toBe("Ali");
        expect(response.body[1].name).toBe("Murad");
    });

    it("should return customer information with queue position", async () => {
        await request(app)
            .post("/api/queue")
            .send({
                name: "Ali"
            });

        const secondCustomer = await request(app)
            .post("/api/queue")
            .send({
                name: "Murad"
            });

        const response = await request(app)
            .get(`/api/queue/${secondCustomer.body.id}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Murad");
        expect(response.body.position).toBe(2);
    });

    it("should call the next customer", async () => {
        await request(app)
            .post("/api/queue")
            .send({
                name: "Ali"
            });

        await request(app)
            .post("/api/queue")
            .send({
                name: "Murad"
            });

        const response = await request(app)
            .post("/api/queue/next");

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Ali");
        expect(response.body.status).toBe("Serving");
    });

    it("should remove a customer from the queue", async () => {
        const customer = await request(app)
            .post("/api/queue")
            .send({
                name: "Ali"
            });

        const response = await request(app)
            .delete(`/api/queue/${customer.body.id}`);

        expect(response.status).toBe(204);
    });

    it("should return 404 for an unknown customer", async () => {
        const response = await request(app)
            .get("/api/queue/9999");

        expect(response.status).toBe(404);
    });

    it("should reject an empty customer name", async () => {
        const response = await request(app)
            .post("/api/queue")
            .send({
                name: ""
            });

        expect(response.status).toBe(400);
    });

    it("should not return the same customer for concurrent /next requests", async () => {
        await request(app)
            .post("/api/queue")
            .send({
                name: "Ali"
            });

        await request(app)
            .post("/api/queue")
            .send({
                name: "Murad"
            });

        const [first, second] = await Promise.all([
            request(app).post("/api/queue/next"),
            request(app).post("/api/queue/next")
        ]);

        expect(first.status).toBe(200);
        expect(second.status).toBe(200);
        expect(first.body.id).not.toBe(second.body.id);

        expect(
            [first.body.name, second.body.name].sort()
        ).toEqual(["Ali", "Murad"]);
    });
});

afterAll(() => {
    db.close();
});