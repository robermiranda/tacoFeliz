"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { ordenes } = require('../datos/orden');
const { menu, modificadores, categoria } = require('../datos/menu');
const { usuarios } = require('../datos/usuario');
const metodoPago = new Map([
    ['1', 'contra entrega'],
    ['2', 'tarjeta crédito']
]);
const ordenEstatus = new Map([
    ['0', 'pre-orden'],
    ['1', 'preparando'],
    ['2', 'entregado'],
    ['3', 'cancelado']
]);
function getMenuDesc(menuId) {
    const menuDesc = menu.find((_menu) => _menu.id === menuId);
    menuDesc.categoria = categoria[menuDesc.categoria];
    const modificadoresDesc = menuDesc.modificadores.map((modificadorId) => {
        return modificadores.find((modificador) => modificador.id === modificadorId);
    });
    menuDesc.modificadores = modificadoresDesc;
    return menuDesc;
}
function getUsuarioDesc(usuarios, usuarioId) {
    const usuario = usuarios.find((usuario) => usuario.id === usuarioId);
    if (usuario)
        return `${usuario.nombre} ${usuario.apPaterno}`;
    return usuarioId;
}
function preValidaOrden(req, res, next) {
    const metodoPago = req.body.metodoPago;
    const direccionEnvio = req.body.direccionEnvio;
    const menu = req.body.menu;
    if (metodoPago && direccionEnvio &&
        Array.isArray(menu) &&
        menu.length > 0) {
        next();
    }
    else
        res.status(400).send({
            status: 'warn',
            msg: 'Los siguientes datos son obligatorios: direccion de envio menu y método de pago'
        });
}
function validaOrdenId(req, res, next) {
    if (req.params.id) {
        const index = ordenes.findIndex((orden) => orden.id === req.params.id);
        if (index > -1)
            next();
        else {
            res.status(400).send({
                status: 'warn',
                msg: 'Orden NO encontrada'
            });
        }
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: 'Se debe especificar el id de la orden'
        });
    }
}
exports.default = router.get('/', function (req, res) {
    // lista de ordenes
    const ordenResponse = ordenes.map((orden) => orden.id);
    if (ordenResponse.length > 0) {
        res.send({
            status: 'ok',
            data: ordenResponse
        });
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: 'NO hay ordenes registradas'
        });
    }
})
    .get('/:ordenId', function (req, res) {
    // caso de uso (usuario final): verificar disponibilidad y totales
    const orden = ordenes.find((orden) => orden.id === req.params.ordenId);
    if (!orden) {
        res.status(400).send({
            status: 'warn',
            msg: 'NO se encontro la orden'
        });
    }
    else {
        const estatusDesc = ordenEstatus.get(orden.estatus);
        const metodoPagoDesc = metodoPago.get(orden.metodoPago);
        const menuDesc = orden.menu.map((menuId) => {
            return getMenuDesc(menuId);
        });
        const ordenResponse = {
            id: orden.id,
            hora: orden.hora,
            estatus: estatusDesc,
            metodoPago: metodoPagoDesc,
            usuario: getUsuarioDesc(usuarios, orden.usuario),
            menu: menuDesc,
            costo: orden.costo,
            direccionEnvio: orden.direccionEnvio,
        };
        res.send({
            status: 'ok',
            data: ordenResponse
        });
    }
})
    .post('/', preValidaOrden, function (req, res) {
    // caso de usu (usuario final): Enviar orden al restaurante
    /*
    const orden: ordenRequestT = {
        usuario: req.body.usuario,
        direccionEnvio: req.body.direccionEnvio,
        metodoPago: req.body.metodoPago,
        menu: req.body.menu,
        modificadores: req.body.modificadores,
    } */
    const { usuario, direccionEnvio, metodoPago, menu, modificadores } = req.body;
    const orden = { usuario, direccionEnvio, metodoPago, menu, modificadores };
    // se procede a enviar la peticion a la base de datos adjuntando la orden
    res.send({
        status: 'ok',
        msg: 'Orden registrada'
    });
})
    .delete('/:id', validaOrdenId, function (req, res) {
    // caso de uso (usuario final): Cancelar orden de pedido
    // En este caso, tanto el usuario final como el usuario admin
    // pueden cancelar un pedido.
    // La diferencia esta en que el usuario admin puede cancelar cualquier
    // orden de pedido, mientras que el usuario final unicamente puede
    // cancelar una orden que le pertenezca a dicho usuario final. Un
    // usuario final NO puede cancelar una orden de otro usuario final.
    res.send({
        status: 'ok',
        msg: 'Orden cancelada'
    });
});
