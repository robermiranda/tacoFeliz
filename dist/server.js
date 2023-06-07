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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const menu_1 = __importDefault(require("./routes/menu"));
const orden_1 = __importDefault(require("./routes/orden"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const sesion_1 = __importDefault(require("./routes/sesion"));
const mongoose_1 = require("mongoose");
require("dotenv/config");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use('/menu', menu_1.default);
app.use('/orden', orden_1.default);
app.use('/usuario', usuario_1.default);
app.use('/sesion', sesion_1.default);
app.use(function (req, res) {
    res.send({ status: 'warn', msg: '404. Recurso no encontrado.' });
});
app.use(function (err, req, res, next) {
    console.error('ERROR 500.', err.message);
    console.error('ERROR DETALLE.', err);
    res.status(500);
    res.send({ status: 'error', msg: 'ERROR en el servidor.' });
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (process.env.DATABASE_URL) {
            console.log('Conectando con base de datos . . . . .');
            yield (0, mongoose_1.connect)(process.env.DATABASE_URL);
            console.log('base de datos conectada');
            app.listen(PORT, () => {
                console.log('SERVER IS UP ON PORT:', PORT);
            });
        }
        else {
            console.error('cadena de conexión a base de datos es vacia');
            process.exit(1);
        }
    }
    catch (error) {
        console.error('SERVER DOWN.', error);
        process.exit(1);
    }
});
start();
