"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const mongoose_1 = require("mongoose");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
(0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.DATABASE_URL) {
        yield (0, mongoose_1.connect)(process.env.DATABASE_URL);
    }
}));
(0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.connection.close();
}));
(0, globals_1.describe)("EXECUTE HTTP GET /orden", () => {
    // CASOS TRIVIALES
    (0, globals_1.it)("GET /orden", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/orden");
        (0, globals_1.expect)(res.statusCode).toBe(200);
        (0, globals_1.expect)(res.body.status).toBe('ok');
    }));
    const ordenId = '6481ef0319fb216c34f4d623';
    (0, globals_1.it)(`GET /orden/${ordenId}`, () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get(`/orden/${ordenId}`);
        (0, globals_1.expect)(res.statusCode).toBe(200);
        (0, globals_1.expect)(res.body.status).toBe('ok');
        (0, globals_1.expect)(res.body.data._id).toBe(ordenId);
    }));
    // CASOS NO TRIVIALES
    // id.length < 24
    (0, globals_1.it)('GET /orden/0', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get('/orden/0');
        (0, globals_1.expect)(res.statusCode).toBe(400);
        (0, globals_1.expect)(res.body.status).toBe('warn');
        (0, globals_1.expect)(res.body.msg).toBe('ID NO VALIDO');
    }));
    // id.length > 24
    const ordenId_2 = '0000000000000000000000000000000000000000';
    (0, globals_1.it)(`GET /orden/${ordenId_2}`, () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get(`/orden/${ordenId_2}`);
        (0, globals_1.expect)(res.statusCode).toBe(400);
        (0, globals_1.expect)(res.body.status).toBe('warn');
        (0, globals_1.expect)(res.body.msg).toBe('ID NO VALIDO');
    }));
    // id.length = 24
    const ordenId_3 = '000000000000000000000000';
    (0, globals_1.it)(`GET /orden/${ordenId_3}`, () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get(`/orden/${ordenId_3}`);
        (0, globals_1.expect)(res.statusCode).toBe(200);
        (0, globals_1.expect)(res.body.status).toBe('warn');
        (0, globals_1.expect)(res.body.msg).toBe('SIN RESULTADOS');
    }));
});
(0, globals_1.describe)("EXECUTE HTTP POST /orden", () => {
    // validando post orden para un id de menu que sí existe
    // modificadores Ids también existen
    // usuarios también es valido
    // En este caso la orden SI es creada
    (0, globals_1.test)('POST /orden [ petición con datos válidos ]', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post('/orden').send({
            usuario: '647c269de10cf06f7279d47d',
            metodoPago: 'CONTRA ENTREGA',
            direccionEnvio: 'Av. Cuitlahuac No. 453, Edif. 15 A 203',
            menu: ["647d0e74be2c79e86b306bc0", "647d1500a126d507b0e2eca9"],
            modificadores: ["647cc4805cc6c871cab3258d", "647cc6415cc6c871cab32590"],
            propina: 0
        });
        (0, globals_1.expect)(res.statusCode).toBe(200);
        (0, globals_1.expect)(res.body.status).toBe('ok');
        (0, globals_1.expect)(res.body.data.id).toBeDefined();
    }));
    // validando post orden con un menu id que no existe
    // En estes caso la orden SI es creada
    // pero no inserta el menu inválido
    (0, globals_1.test)('POST /orden con menu Id NO valido', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post('/orden').send({
            usuario: '647c269de10cf06f7279d47d',
            metodoPago: 'CONTRA ENTREGA',
            direccionEnvio: 'Av. Cuitlahuac No. 453, Edif. 15 A 203',
            menu: ["647d0e74be2c79e86b306bc0", "647d1500a126d507b0e2eca8"],
            modificadores: ["647cc4805cc6c871cab3258d", "647cc6415cc6c871cab32590"],
            propina: 0
        });
        (0, globals_1.expect)(res.statusCode).toBe(200);
        (0, globals_1.expect)(res.body.status).toBe('ok');
    }));
    // validando post orden con un modificador id que no existe
    // En estes caso la orden SI es creada pero no ingresa el modificador no valido
    (0, globals_1.test)('POST /orden [ con modificador Id NO valido ]', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post('/orden').send({
            usuario: '647c269de10cf06f7279d47d',
            metodoPago: 'CONTRA ENTREGA',
            direccionEnvio: 'Av. Cuitlahuac No. 453, Edif. 15 A 203',
            menu: ["647d0e74be2c79e86b306bc0", "647d1500a126d507b0e2eca9"],
            modificadores: ["647cc4805cc6c871cab3258d", "647cc6415cc6c871cab32591"],
            propina: 0
        });
        (0, globals_1.expect)(res.statusCode).toBe(200);
        (0, globals_1.expect)(res.body.status).toBe('ok');
    }));
    (0, globals_1.test)('POST /orden con usuario id NO válido', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post('/orden').send({
            usuario: '647c269de10cf06f7279d47f',
            metodoPago: 'CONTRA ENTREGA',
            direccionEnvio: 'Av. Cuitlahuac No. 453, Edif. 15 A 203',
            menu: ["647d0e74be2c79e86b306bc0", "647d1500a126d507b0e2eca9"],
            modificadores: ["647cc4805cc6c871cab3258d", "647cc6415cc6c871cab32590"],
            propina: 0
        });
        (0, globals_1.expect)(res.statusCode).toBe(400);
        (0, globals_1.expect)(res.body.status).toBe('warn');
        (0, globals_1.expect)(res.body.msg).toBe('USUARIO ID NO VALIDO');
    }));
    (0, globals_1.test)('POST /orden/totales [petición válida]', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post('/orden/totales').send({
            menu: ["647d0e74be2c79e86b306bc0", "647d1500a126d507b0e2eca9"],
            modificadores: ["647cc4805cc6c871cab3258d", "647cc6415cc6c871cab32590"],
            propina: 0.1
        });
        (0, globals_1.expect)(res.statusCode).toBe(200);
        (0, globals_1.expect)(res.body.status).toBe('ok');
        (0, globals_1.expect)(res.body.data.totales.total).toBe(362.45);
    }));
});
