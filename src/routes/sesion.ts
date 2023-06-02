import express, { NextFunction, Request, Response } from 'express';
import { sesiones } from '../datos/sesion';
//import { usuarios, tipoUsuario, estatusUsuario } from '../datos/usuario';


const router = express.Router();

router.get('/', function (req: Request, res: Response) {
    res.send({
        status: 'ok',
        data: sesiones,
    });
});

export default router;