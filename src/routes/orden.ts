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

router.get('/', function (req: Request, res: Response) {
    
    const ordenResponse: ordenCompuestaT = ordenes.map((orden: ordenBasicaT) => {
        const estatusDesc: string | undefined = ordenEstatus.get(orden.estatus);
        const metodoPagoDesc: string | undefined = metodoPago.get(orden.metodoPago);
        const menuDesc: any = orden.menu.map((menuId: string) => {
            return getMenuDesc(menuId);
        });
        
        return {
            id: orden.id,
            hora: orden.hora,
            estatus: estatusDesc,
            metodoPago: metodoPagoDesc,
            usuario: getUsuarioDesc(usuarios, orden.usuario),
            menu: menuDesc,
            costo: orden.costo,
            direccionEnvio: orden.direccionEnvio,
        }
    });

    res.send(ordenResponse);
})
.delete('/:id', validaOrdenId, function (req: Request, res: Response) {
    // caso de uso (usuario final): Cancelar orden de pedido
    res.send({
        status: 'ok',
        msg: 'Orden cancelada'
    });
});

export default router;

export type costoT = {
    totalPlatillos: number,
    totalModificadores: number,
    subTotal: number,
    propina: number,
    total: number
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
