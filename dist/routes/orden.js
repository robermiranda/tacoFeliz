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
const util_1 = require("../util");
const router = express_1.default.Router();
exports.default = router.get('/', function (req, res) {
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
            const menu = yield Orden_1.Orden.findOne({ _id: req.params.id }).exec();
            if (menu)
                res.send((0, util_1.stdRes)('ok', undefined, menu));
            else
                res.send((0, util_1.stdRes)('warn', 'Sin resultados'));
        }
        catch (err) {
            (0, util_1.throwError)(err, res);
        }
    });
})
    .post('/', preValidaOrden, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario final
        // caso de usu: Enviar orden al restaurante
        const { usuario, direccionEnvio, metodoPago, menu: menus, modificadores, propina } = req.body;
        let _propina = 0;
        if (propina)
            _propina = Number.parseFloat(propina);
        // Se obtienen los menus y los modificadores de la orden
        try {
            let totalPlatillos = 0;
            let totalModificadores = 0;
            for (const menu of yield Menu_1.Menu.find().where('_id').in(menus).exec()) {
                if (menu.precio)
                    totalPlatillos += menu.precio;
            }
            for (const modificador of yield Modificador_1.Modificador.find().where('_id').in(modificadores).exec()) {
                if (modificador.precio)
                    totalModificadores += modificador.precio;
            }
            // Se calculan subtotal y total
            const subTotal = totalPlatillos + totalModificadores;
            const total = (1 + _propina) * subTotal;
            const costo = {
                totalPlatillos,
                totalModificadores,
                propina: _propina,
                subTotal,
                total
            };
            const orden = {
                usuario,
                direccionEnvio,
                metodoPago,
                menu: menus,
                modificadores,
                costo
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
function validaPropina(_propina) {
    const propina = Number.parseFloat(_propina);
    if (Number.isNaN(propina))
        return false;
    const index = [0, 5, 10, 15].findIndex((x) => x === propina);
    return (index >= 0);
}
function validaMetodoPago(metodoPago) {
    if (!metodoPago)
        return false;
    const index = ["TARJETA CREDITO", "CONTRA ENTREGA"].findIndex(x => x === metodoPago);
    return (index >= 0);
}
function validaArrayIds(menus) {
    if (!Array.isArray(menus))
        return false;
    // Se limita a un array de 19 id's
    if (menus.length > 20)
        return false;
    // An Schema.Types.ObjectId must have a length = 24
    return menus.every(x => x.length === 24);
}
function preValidaOrden(req, res, next) {
    const { usuario, direccionEnvio, metodoPago, menu, modificadores, propina } = req.body;
    if (usuario &&
        direccionEnvio && direccionEnvio.length <= 50 &&
        validaMetodoPago(metodoPago) &&
        validaArrayIds(menu) &&
        (!modificadores || validaArrayIds(modificadores)) &&
        (!propina || validaPropina(propina))) {
        next();
    }
    else {
        res.status(400)
            .send((0, util_1.stdRes)('warn', 'Los datos de entrada NO son validos'));
    }
}
function validaOrdenId(req, res, next) {
    if (req.params.id.length === 24)
        next();
    else {
        res.status(400)
            .send((0, util_1.stdRes)('warn', 'Id NO válido. Este debe ser de 24 hex chars.'));
    }
}
