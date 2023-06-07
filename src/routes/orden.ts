import express, { NextFunction, Request, Response } from 'express';
//import { PrismaClient } from '@prisma/client';

const router = express.Router();
//const prisma = new PrismaClient();

const { ordenes } = require('../datos/orden');
const { menu, modificadores, categoria } = require('../datos/menu');
const { usuarios } = require('../datos/usuario');


export default router.get('/', function (req: Request, res: Response) {
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
.get('/', function (req: Request, res: Response) {
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
.get('/:ordenId', function (req: Request, res: Response) {
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
.post('/', preValidaOrden, async function (req: Request, res: Response) {
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

})
.delete('/:id', validaOrdenId, function (req: Request, res: Response) {
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


type ordenEstatusT = "PREPARANDO" | "ENTREGADO" | "CANCELADO";

type metodoPagoT = "TARJETA CREDITO" | "CONTRA ENTREGA";

type costoT = {
    totalPlatillos:     number,
    totalModificadores: number,
    propina:            number,
    subTotal:           number,
    total:              number
}

type ordenT = {
    estatus:        ordenEstatusT,
    usuario:        string,
    direccionEnvio: string,
    metodoPago:     metodoPagoT,
    menu:           string[],
    modificadores:  string[],
    costo:          costoT
}

function getMenuDesc (menuId: string) {

    const menuDesc = menu.find((_menu: any) => _menu.id === menuId);
    menuDesc.categoria = categoria[menuDesc.categoria];

    const modificadoresDesc: any[] = menuDesc.modificadores.map((modificadorId: string) => {
        return modificadores.find((modificador: any) => modificador.id === modificadorId);
    });

    menuDesc.modificadores = modificadoresDesc;

    return menuDesc;
}

function getUsuarioDesc (usuarios: any[], usuarioId: string): string {
    const usuario: any = usuarios.find((usuario: any) => usuario.id === usuarioId);
    if (usuario) return `${usuario.nombre} ${usuario.apPaterno}`;
    return usuarioId;
}

function preValidaOrden (req: Request, res: Response, next: NextFunction) {
    const metodoPago: string = req.body.metodoPago;
    const direccionEnvio: string = req.body.direccionEnvio;
    const menu: string[] = req.body.menu;

    if (metodoPago && direccionEnvio &&
        Array.isArray(menu) &&
        menu.length > 0) {
        
        next();
    }
    else res.status(400).send({
        status: 'warn',
        msg: 'Los siguientes datos son obligatorios: direccion de envio menu y método de pago'
    });
}

function validaOrdenId (req: Request, res: Response, next: NextFunction) {
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
