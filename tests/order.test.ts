import { describe, expect, beforeEach, afterEach, it} from '@jest/globals';
import { connect, connection } from "mongoose";
import request from "supertest";
import { app } from "../src/app";


beforeEach(async () => {
    if (process.env.DATABASE_URL) {
        await connect(process.env.DATABASE_URL);
    }
});

afterEach(async () => {
    await connection.close();
});


describe("GET /orden", () => {
    it("devuleve lista de ordenes", async () => {
        const res = await request(app).get("/orden");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});
