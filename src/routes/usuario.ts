import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const TIPO_USUARIO = {
    final: 'FINAL',
    admin: 'SUPER_ADMIN'
}
const ESTATUS = {
    activo: 'ACTIVO',
    bloquedao: 'BLOQUEADO'
}
const prisma = new PrismaClient();
const router = express.Router();


export default router.get('/', async function (req: Request, res: Response) {
    try {
        const usuarios = await prisma.usuarios.findMany();
        res.send({
            status: 'ok',
            msg: `usuarios obtenidos: ${usuarios.length}`,
            data: usuarios
        });
    }
    catch (err) {
        console.error('ERROR al obtener todos los usuarios', err);
        res.status(500).send({
            status: 'error',
            msg: 'ERROR al obtener los usuarios'
        });
    }
})
.post('/', validaUsuario, async function (req: Request, res: Response) {
    // usuario final
    // caso de uso: Registro en aplicación

    const usuario: usuarioT = {
        email: req.body.email,
        tipo: TIPO_USUARIO.final,
        estatus: ESTATUS.activo,
        password: req.body.password,
        nombre: req.body.nombre,
    }

    if (req.body.apPaterno) usuario.apPaterno = req.body.apPaterno;
    if (req.body.apMaterno) usuario.apMaterno = req.body.apMaterno;

    try {
        await prisma.usuarios.create({
            data: usuario
        });

        res.send({
            status: 'ok'
        });
    }
    catch (err) {
        console.error('ERROR al insertar usuario', usuario.email, err);
        res.status(500).send({
            status: 'error',
            msg: 'usuario NO registrado'
        });
    }
})
.patch('/', async function (req: Request, res: Response) {
    // caso de uso (usuario admin): bloquear usuario

    // se procede a llamar al endpoint de la base de datos para cancelar al usuario
    // para lo cual se debe proporcionar dos parametros:
    // email del usuario a eliminar: emailUsuario
    // recuerdese que solo el usuario admin puede bloquear usuarios

    try {
        const bloqueado = await prisma.usuarios.update({
            where: {
                email: req.body.emailUsuario
            },
            data: {
                estatus: ESTATUS.bloquedao
            }
        });

        res.send({
            status: 'ok',
            msg: 'usuario bloqueado'
        });
    }
    catch (err) {
        const msg = `ERROR al bloquear usuario ${req.body.emailUsuario}`;
        console.error(msg, err);
        res.status(500).send({
            status: 'error',
            msg
        });
    }
});


export type usuarioT = {
    id?: string,
    tipo: string,
    estatus: string,
    nombre: string,
    apPaterno?: string,
    apMaterno?: string,
    email: string,
    password: string
}

function validaUsuario (req: Request, res: Response, next: NextFunction) {
    
    const LENGTH = 40;
    const { nombre, apPaterno, email, password } = req.body;

    if (nombre && nombre.length <= LENGTH &&
        apPaterno && apPaterno.length <= LENGTH &&
        email && email.length <= LENGTH &&
        password && password.length <= LENGTH) {
    
        next();
    }
    else res.status(400).send({
        status: 'warn',
        msg: 'Los siguientes datos son obligatorios: nombre, apPaterno, correo electronico y contraseña'
    });
}

