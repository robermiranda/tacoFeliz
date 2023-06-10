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
const Orden_1 = require("../models/Orden");
const Menu_1 = require("../models/Menu");
const Modificador_1 = require("../models/Modificador");
const Usuario_1 = require("../models/Usuario");
const util_1 = require("../util");
exports.default = express_1.default.Router()
    .get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario Adimin
        // Obtiene la lista de menu
        try {
            const menu = yield Orden_1.Orden.find({});
            res.send((0, util_1.stdRes)('ok', `menus obtenidos: ${menu.length}`, menu));
        }
        catch (err) {
            (0, util_1.throwError)(err, res);
        }
    });
})
    .get('/:id', validaOrdenId, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuarios: admin y final
        // caso de uso: Verificar diponibilidad y totales
        try {
            const menu = yield Orden_1.Orden.findById(req.params.id).exec();
            if (menu)
                res.send((0, util_1.stdRes)('ok', undefined, menu));
            else
                res.send((0, util_1.stdRes)('warn', 'SIN RESULTADOS'));
        }
        catch (err) {
            (0, util_1.throwError)(err, res);
        }
    });
})
    .post('/totales', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario fianl
        // caso uso: verificar disponibilidad y totales
        // devuleve el total de la orden desglozada
        const { menu: menus, modificadores, propina: _propina } = req.body;
        try {
            let propina = getPropina(_propina);
            const menuDocs = yield Menu_1.Menu.find().where('_id').in(menus).exec();
            const modificadoresDocs = yield Modificador_1.Modificador.find().where('_id').in(modificadores).exec();
            const totales = getTotales(menuDocs, modificadoresDocs, propina);
            const menusNoDisponibles = menuDocs
                .filter((menu) => !menu.disponibilidad)
                .map((menu) => {
                return {
                    id: menu._id,
                    nombre: menu.nombre
                };
            });
            const modificadoresNoDisponibles = modificadoresDocs
                .filter((modificador) => !modificador.disponibilidad)
                .map((modificador) => {
                return {
                    id: modificador._id,
                    nombre: modificador.nombre
                };
            });
            res.send((0, util_1.stdRes)('ok', undefined, {
                totales,
                menusNoDisponibles,
                modificadoresNoDisponibles
            }));
        }
        catch (err) {
            (0, util_1.throwError)(err, res, 'ERROR AL OBTENER TOTALES');
        }
    });
})
    .post('/', preValidaOrden, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario final
        // caso de usu: Enviar orden al restaurante
        const { usuario, direccionEnvio, metodoPago, menu: menus, modificadores, propina: _propina } = req.body;
        try {
            let propina = getPropina(_propina);
            const menuDocs = yield Menu_1.Menu.find().where('_id').in(menus).exec();
            const modificadoresDocs = yield Modificador_1.Modificador.find().where('_id').in(modificadores).exec();
            const totales = getTotales(menuDocs, modificadoresDocs, propina);
            const orden = {
                usuario,
                direccionEnvio,
                metodoPago,
                menu: menuDocs.map((menu) => menu._id),
                modificadores: modificadoresDocs.map((modificador) => modificador._id),
                costo: totales
            };
            const response = yield Orden_1.Orden.create(orden);
            res.send((0, util_1.stdRes)('ok', undefined, { id: response._id }));
        }
        catch (err) {
            (0, util_1.throwError)(err, res);
        }
    });
})
    .patch('/estatus', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuarios final y admin
        // caso de uso: Cancelar una orden si su estado es PREPARANDO
        const cancelado = 'CANCELADO';
        const preparando = 'PREPARANDO';
        try {
            const response = yield Orden_1.Orden.updateOne({
                _id: req.body.id,
                estatus: preparando
            }, { estatus: cancelado });
            let stdres;
            if (response.modifiedCount === 1)
                stdres = (0, util_1.stdRes)('ok');
            else
                stdres = (0, util_1.stdRes)('warn', 'orden NO cancelada');
            res.send(stdres);
        }
        catch (err) {
            (0, util_1.throwError)(err, res);
        }
    });
});
// Funciones Auxiliares  ******************************************************
function getPropina(_propina) {
    let propina = 0;
    if (_propina) {
        const pparsed = Number.parseFloat(_propina);
        if (!Number.isNaN(pparsed) && [0, 0.5, 0.1, 0.15].includes(pparsed))
            propina = pparsed;
    }
    return propina;
}
function validaMetodoPago(metodoPago) {
    if (!metodoPago)
        return false;
    const index = ["TARJETA CREDITO", "CONTRA ENTREGA"].findIndex(x => x === metodoPago);
    return (index >= 0);
}
function preValidaOrden(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { usuario, direccionEnvio, metodoPago } = req.body;
        if (!(yield validaUsuarioId(usuario))) {
            res.status(400)
                .send((0, util_1.stdRes)('warn', 'USUARIO ID NO VALIDO'));
        }
        else if (direccionEnvio &&
            direccionEnvio.length <= 50 &&
            validaMetodoPago(metodoPago)) {
            next();
        }
        else {
            res.status(400)
                .send((0, util_1.stdRes)('warn', 'DATOS DE ENTRADA NO VALIDOS'));
        }
    });
}
function validaOrdenId(req, res, next) {
    if (req.params.id.length === 24)
        next();
    else {
        res.status(400)
            .send((0, util_1.stdRes)('warn', 'ID NO VALIDO'));
    }
}
function validaUsuarioId(usuarioId) {
    return __awaiter(this, void 0, void 0, function* () {
        const usuario = yield Usuario_1.Usuario.findById(usuarioId).exec();
        return usuario ? true : false;
    });
}
function getTotales(menus, modificadores, propina) {
    let totalPlatillos = 0;
    let totalModificadores = 0;
    for (const menu of menus) {
        if (menu.disponibilidad && menu.precio)
            totalPlatillos += menu.precio;
    }
    for (const modificador of modificadores) {
        if (modificador.disponibilidad && modificador.precio) {
            totalModificadores += modificador.precio;
        }
    }
    // Se calculan subtotal y total
    const subTotal = totalPlatillos + totalModificadores;
    const totalStr = Number.parseFloat(`${(1 + propina) * subTotal}`).toFixed(2);
    return {
        totalPlatillos,
        totalModificadores,
        propina,
        subTotal,
        total: Number.parseFloat(totalStr)
    };
}
