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
//import { PrismaClient } from '@prisma/client';
const router = express_1.default.Router();
//const prisma = new PrismaClient();
const { ordenes } = require('../datos/orden');
const { menu, modificadores, categoria } = require('../datos/menu');
const { usuarios } = require('../datos/usuario');
exports.default = router.get('/', function (req, res) {
    // lista de ordenes
    /*const ordenResponse: string[] = ordenes.map((orden: ordenBasicaT) => orden.id);

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
    }*/
})
    .get('/', function (req, res) {
    /*

    try {
        const menu = await prisma.menu.findMany();
        res.send({
            status: 'ok',
            msg: `menus obtenidos: ${menu.length}`,
            data: menu
        });
    }
    catch (err) {
        // console.error('ERROR al obtener la lista de menú', err);
        res.status(500).send({
            status: 'error',
            msg: 'ERROR al obtener lista de menú'
        });
    }
    */
})
    .get('/:ordenId', function (req, res) {
    // caso de uso (usuario final): verificar disponibilidad y totales
    //const orden: ordenCompuestaT = ordenes.find((orden: ordenBasicaT) => orden.id === req.params.ordenId);
    /*
        if ( ! orden) {
            res.status(400).send({
                status: 'warn',
                msg: 'NO se encontro la orden'
            });
        }
        else {
            const estatusDesc: string | undefined = ordenEstatus.get(orden.estatus);
            const metodoPagoDesc: string | undefined = metodoPago.get(orden.metodoPago);
            const menuDesc: any = orden.menu.map((menuId: string) => {
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
            }
    
            res.send({
                status: 'ok',
                data: ordenResponse
            });
        }*/
})
    .post('/', preValidaOrden, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario final
        // caso de usu: Enviar orden al restaurante
        /*
            const { usuario, direccionEnvio, metodoPago, menu, modificadores } = req.body;
        
            const costo: costoT = {
                totalPlatillos: 0,
                totalModificadores: 0,
                propina: 0,
                subTotal: 0,
                total: 0
            }
        
            const orden: ordenT = {
                estatus: "PREPARANDO",
                usuario,
                direccionEnvio,
                metodoPago,
                menu,
                modificadores,
                costo
            };
        
            try {
                await prisma.orden.create({
                    data: orden
                });
        
                res.send({
                    status: 'ok'
                });
            }
            catch (err) {
                // console.error('ERROR al insertar modificador', menu.nombre, err);
                res.status(500).send({
                    status: 'error',
                    msg: 'modificador NO registrado'
                });
            }*/
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
    /*
    if (req.params.id) {
        const index: number = ordenes.findIndex((orden: ordenT) => orden.id === req.params.id);
        if (index > -1) next();
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
    }*/
}
