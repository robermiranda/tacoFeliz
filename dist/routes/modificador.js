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
const Modificador_1 = require("../models/Modificador");
const util_1 = require("../util");
const router = express_1.default.Router();
exports.default = router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario Admin
        // devuelve lista de modificadores
        try {
            const modificadores = yield Modificador_1.Modificador.find({});
            res.send((0, util_1.stdRes)('ok', `modificadores obtenidos: ${modificadores.length}`, modificadores));
        }
        catch (err) {
            res.status(500).send((0, util_1.stdRes)('error', 'ERROR al obtener modificadores'));
            throw err;
        }
    });
})
    .post('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // caso de uso: dar alta a un modificador
        const modificador = {
            nombre: req.body.nombre,
            precio: req.body.precio
        };
        try {
            const _modificador = yield Modificador_1.Modificador.create(modificador);
            res.send((0, util_1.stdRes)('ok', `modificador creado con id: ${_modificador._id}`));
        }
        catch (err) {
            res.status(500).send((0, util_1.stdRes)('error', 'modificador NO registrado'));
            throw err;
        }
    });
})
    .delete('/:nombre', validaModificadorNombre, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // caso de uso: eliminar un modificador
        try {
            const response = yield Modificador_1.Modificador.deleteOne({ nombre: req.params.nombre });
            if (response.deletedCount === 1)
                res.send((0, util_1.stdRes)('ok'));
            else
                res.send((0, util_1.stdRes)('warn', 'modificador NO eliminado'));
        }
        catch (err) {
            res.status(500).send((0, util_1.stdRes)('error', 'modificador NO eliminado'));
            throw err;
        }
    });
})
    .patch('/', validaModificadorParaEditar, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // caso de uso: editar un modificador
        // por simplicidad se ha dado la capacidad de editar unicamente
        // el precio y la disponibilidad, dejando al nombre como identificador
        // del modificador
        const { nombre, disponibilidad, precio } = req.body;
        const modificador = {};
        if (disponibilidad)
            modificador.disponibilidad = getBooleanVal(disponibilidad);
        if (precio)
            modificador.precio = Number.parseFloat(precio);
        try {
            const response = yield Modificador_1.Modificador.updateOne({ nombre }, modificador);
            if (response.modifiedCount === 1)
                res.send((0, util_1.stdRes)('ok'));
            else
                res.status(400).send((0, util_1.stdRes)('warn', 'modificador NO actualizado'));
        }
        catch (err) {
            res.status(500).send((0, util_1.stdRes)('error', 'modificador NO actualizado'));
        }
    });
});
// Funciones Auxiliares  ******************************************************
const getBooleanVal = (val) => (val === 'true');
const PRECIO_MIN = 0;
function validaModificadorParaEditar(req, res, next) {
    const { nombre, precio, disponibilidad } = req.body;
    const _precio = Number.parseFloat(precio);
    if (nombre && (disponibilidad ||
        (!Number.isNaN(_precio) && _precio >= PRECIO_MIN))) {
        next();
    }
    else {
        res.status(400).send((0, util_1.stdRes)('warn', `Datos obligatorios: nombre y (precio >= 0 o disponibilidad)`));
    }
}
function validaModificadorNombre(req, res, next) {
    if (req.params.nombre)
        next();
    else {
        res.status(400).send((0, util_1.stdRes)('warn', 'Se debe especificar el nombre del modificador'));
    }
}
