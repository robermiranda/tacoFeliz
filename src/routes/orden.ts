import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();
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
    }
}

export default router.get('/', function (req: Request, res: Response) {
    // lista de ordenes
    const ordenResponse: string[] = ordenes.map((orden: ordenBasicaT) => orden.id);

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
.get('/:ordenId', function (req: Request, res: Response) {
    // caso de uso (usuario final): verificar disponibilidad y totales
    const orden: ordenCompuestaT = ordenes.find((orden: ordenBasicaT) => orden.id === req.params.ordenId);

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
    }
})
.post('/', preValidaOrden, function (req: Request, res: Response) {
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

    const orden: ordenRequestT = {usuario, direccionEnvio, metodoPago, menu, modificadores};

    // se procede a enviar la peticion a la base de datos adjuntando la orden

    res.send({
        status: 'ok',
        msg: 'Orden registrada'
    });

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


export type costoT = {
    totalPlatillos: number,
    totalModificadores: number,
    subTotal: number,
    propina: number,
    total: number
}

type ordenRequestT = {
    usuario: string,
    direccionEnvio: string,
    metodoPago: string,
    menu: string[],
    modificadores: string[],
}

export type ordenT = {
    id: string,
    usuario: string,
    // hora servicio: 10 HRS. - 18 HRS
    hora: string,
    estatus: string,
    costo: costoT,
    direccionEnvio: string,
    metodoPago: string
}

export type ordenBasicaT = ordenT & {
    menu: string[],
    modificadores: string[]
}

type ordenCompuestaT = ordenT & {
    menu: any[]
}
