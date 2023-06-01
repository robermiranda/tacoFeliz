const express = require('express');
const router = express.Router();
const { orden, metodoPago, ordenEstatus } = require('../datos/orden');
const { menu, modificadores, categoria } = require('../datos/menu');

function getMenuDesc (menuId: string) {

    const menuDesc = menu.find((_menu: any) => _menu.id === menuId);
    menuDesc.categoria = categoria[menuDesc.categoria];

    const modificadoresDesc: any[] = menuDesc.modificadores.map((modificadorId: string) => {
        return modificadores.find((modificador: any) => modificador.id === modificadorId);
    });

    menuDesc.modificadores = modificadoresDesc;

    return menuDesc;
}

router.get('/', function (req: any, res: any) {
    
    const ordenResponse = orden.map((_orden: any) => {
        const estatusDesc: string = ordenEstatus[_orden.estatus];
        const metodoPagoDesc: string = metodoPago[_orden.metodoPago];
        const menuDesc: any = _orden.menu.map((menuId: string) => {
            return getMenuDesc(menuId);
        });

        return {
            ..._orden,
            estatus: estatusDesc,
            metodoPago: metodoPagoDesc,
            menu: menuDesc,
            modificadores: null
        }
    });

    res.send(ordenResponse);
});

export default router;
