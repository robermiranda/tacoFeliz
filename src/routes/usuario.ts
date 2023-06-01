const express = require('express');
const router = express.Router();
const { usuarios, tipoUsuario, estatusUsuario } = require('../datos/usuario');


router.get('/', function (req: any, res: any) {
    
    const usuarioResponse = usuarios.map((usuario: any) => {
        return {
            ...usuario,
            tipo: tipoUsuario[usuario.tipo],
            estatus: estatusUsuario[usuario.estatus],
        }
    });
    
    res.send(usuarioResponse);
});


export default router;
