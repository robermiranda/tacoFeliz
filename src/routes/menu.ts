import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();
const {categoria, modificadores, menu} = require('../datos/menu');

export default router.get('/', function (req: Request, res: Response) {
    // devuleve la lista de menú
    // esta acción solo la puede ejecutar el usuario admin
    res.send({
        status: 'ok',
        data: menu
    })
})
.get('/detalle', function (req: Request, res: Response) {
    // caso de uso (usuario final): ver menú
    const menuResponse = menu.map((_menu: any) => {
        const categoriaDesc = categoria[_menu.categoria];
        
        const modificadoresDesc = _menu.modificadores.map((modificadorId: string) => {
            return modificadores.find((modificador: any) => modificador.id === modificadorId);
        });

        return {
            ..._menu,
            categoria: categoriaDesc,
            modificadores: modificadoresDesc
        }

    });

    res.send({
        status: 'ok',
        data: menuResponse
    });
})
.get('/modificadores', function (req: Request, res: Response) {
    // devuleve la lista de modificadores
    // esta acción solo la puede ejecutar el usuario admin
    res.send({
        status: 'ok',
        data: modificadores
    })
});
