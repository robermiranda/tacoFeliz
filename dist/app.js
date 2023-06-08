"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const menu_1 = __importDefault(require("./routes/menu"));
const modificador_1 = __importDefault(require("./routes/modificador"));
const orden_1 = __importDefault(require("./routes/orden"));
const usuario_1 = __importDefault(require("./routes/usuario"));
require("dotenv/config");
exports.app = (0, express_1.default)()
    .use(body_parser_1.default.json())
    .use((0, morgan_1.default)('dev'))
    .use('/menu', menu_1.default)
    .use('/modificador', modificador_1.default)
    .use('/orden', orden_1.default)
    .use('/usuario', usuario_1.default)
    .use(function (req, res) {
    res.send({ status: 'warn', msg: '404. Recurso no encontrado.' });
})
    .use(function (err, req, res, next) {
    console.error('ERROR 500.', err.message);
    console.error('ERROR DETALLE.', err);
    res.status(500);
    res.send({ status: 'error', msg: 'ERROR en el servidor.' });
});
