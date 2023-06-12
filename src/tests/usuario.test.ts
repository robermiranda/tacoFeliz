import { describe, expect, beforeAll, afterAll, it, test } from '@jest/globals';
import { connect, connection } from "mongoose";
import request from "supertest";
import { app } from "../app";


beforeAll(async () => {
    if (process.env.DATABASE_URL) {
        await connect(process.env.DATABASE_URL);
    }
});

afterAll(async () => {
    await connection.close();
});


describe.skip("EXECUTE HTTP GET /usuario", () => {

    // CASOS TRIVIALES
    test("GET /usuario", async () => {
        const res = await request(app).get("/usuario");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});

describe("EXECUTE HTTP POST /usuario", () => {

    test("POST /usuario [ petición con datos NO válidos]", async () => {
        const res = await request(app).post('/usuario').send({
            nombre: ["1", "2"],
            email: 'xyz@gmail.com',
            password: "123"
        });

        expect(res.statusCode).toBe(500);
        expect(res.body.status).toBe('error');
    });
});
