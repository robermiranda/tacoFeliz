const express = require('express');
const router = express.Router();
const { ordenes, metodoPago, ordenEstatus } = require('../datos/orden');
const { menu, modificadores, categoria } = require('../datos/menu');
const { usuarios } = require('../datos/usuario');

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


router.get('/', function (req: any, res: any) {
    
    const ordenResponse: ordenCompuestaT = ordenes.map((orden: ordenBasicaT) => {
        const estatusDesc: string = ordenEstatus[orden.estatus];
        const metodoPagoDesc: string = metodoPago[orden.metodoPago];
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