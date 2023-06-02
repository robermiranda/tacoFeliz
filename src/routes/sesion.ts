import express, { NextFunction, Request, Response } from 'express';
import { sesiones } from '../datos/sesion';
import { usuarios, tipoUsuario, estatusUsuario } from '../datos/usuario';
import { usuarioT } from './usuario';

const router = express.Router();

function preValidaCredenciales (req: Request, res: Response, next: NextFunction) {
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (email && password) next();
    else res.status(400).send({
        status: 'warn',
        msg: 'Los siguientes datos son obligatorios: correo electronico y contraseña'
    });
}

router.get('/', function (req: Request, res: Response) {      
    res.send({
        status: 'ok',
        data: sesiones,
    });
})
.post('/', preValidaCredenciales, function (req: Request, res: Response) {
    // caso de uso: Iniciar sesion
    const usuario: usuarioT | undefined = usuarios.find((usuario: usuarioT) => {
        return usuario.email === req.body.email
    });

    if ( ! usuario) {
        res.status(400).send({
            status: 'warn',
            msg: 'Usuario NO encontrado'
        });
    }
    else {
        if (usuario.password !== req.body.password) {
            res.status(400).send({
                status: 'warn',
                msg: 'Credenciales NO válidas'
            });
        }
        else {
            // Se crea la sesión
            const sesionId: string = '123opq';
            res.send({
                status: 'ok',
                msg: 'Usuario Autenticado',
                data: {
                    sesionId
                }
            });
        }
    }
});

export type sesionT = {
    id: string,
    usuarioId: string,
    // conviene guardar la hora como timestamp
    // para facilitar el calculo de expiración de la sesion 
    // 5 minutos = 300 segundos = 300,000 milisegundos
    hora: string | number,
    datos?: any
}

export default router;