import { describe, expect, beforeAll, afterAll, it, test } from '@jest/globals';
import { connect, connection } from "mongoose";
import request from "supertest";
import { app } from "../src/app";


beforeAll(async () => {
    if (process.env.DATABASE_URL) {
        await connect(process.env.DATABASE_URL);
    }
});

afterAll(async () => {
    await connection.close();
});


describe("EXECUTE HTTP GET /orden", () => {

    // CASOS TRIVIALES
    it("GET /orden", async () => {
        const res = await request(app).get("/orden");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    const ordenId = '6481ef0319fb216c34f4d623';
    it(`GET /orden/${ordenId}`, async () => {
        const res = await request(app).get(`/orden/${ordenId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.data._id).toBe(ordenId);
    });

    // CASOS NO TRIVIALES
    // id.length < 24
    it('GET /orden/0', async () => {
        const res = await request(app).get('/orden/0');
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('warn');
        expect(res.body.msg).toBe('ID NO VALIDO');
    });

    // id.length > 24
    const ordenId_2 = '0000000000000000000000000000000000000000';
    it(`GET /orden/${ordenId_2}`, async () => {
        const res = await request(app).get(`/orden/${ordenId_2}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('warn');
        expect(res.body.msg).toBe('ID NO VALIDO');
    });

    // id.length = 24
    const ordenId_3 = '000000000000000000000000';
    it(`GET /orden/${ordenId_3}`, async () => {
        const res = await request(app).get(`/orden/${ordenId_3}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('warn');
        expect(res.body.msg).toBe('SIN RESULTADOS');
    });
});

describe.skip("EXECUTE HTTP POST /orden", () => {

    test(' POST /orden', async () => {
        const res = await request(app).post('/orden').send({
            usuario: '647c269de10cf06f7279d47d',
            metodoPago: 'TARJETA CREDITO',
            direccionEnvio: 'Lago Zirahuen No. 34',
            menu: ["647d0e74be2c79e86b306bc0", "647d1500a126d507b0e2eca9"],
            modificadores: ["647cc4805cc6c871cab3258d", "647cc6415cc6c871cab32590"],
            propina: 0
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.data.id.length).toBe(24);
    });
});
