const express = require('express');
const router = express.Router();
const {categoria, modificadores, menu} = require('../datos/menu');

// caso de uso: ver menú
export default router.get('/', function (req: any, res: any) {
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

    res.send(menuResponse);
});
