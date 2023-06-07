import express, { NextFunction, Request, Response } from 'express';
import { Usuario, ESTATUS_USUARIO } from '../models/Usuario';
import { stdRes } from '../util';


const router = express.Router();

export default router.get('/', async function (req: Request, res: Response) {
    // usuario admin
    // obtiene la lista de usuarios
    
    try {
        const usuarios = await Usuario.find({});
        res.send(stdRes('ok', `usuarios obtenidos: ${usuarios.length}`, usuarios));
    }
    catch (err) {
        res.status(500).send(stdRes('error','ERROR al obtener los usuarios'));
    }
})
.post('/', validaUsuario, async function (req: Request, res: Response) {
    // usuario final
    // caso de uso: Registro en aplicación

    const usuario: usuarioT = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
    }

    if (req.body.apPaterno) usuario.apPaterno = req.body.apPaterno;
    if (req.body.apMaterno) usuario.apMaterno = req.body.apMaterno;

    try {
        const _usuario = await Usuario.create(usuario);
        res.send(stdRes('ok', `usuario creado con id: ${_usuario._id}`));
    }
    catch (err) {
        console.error('ERROR al insertar usuario', usuario.email, err);
        res.status(500).send(stdRes('error', 'usuario NO registrado'));
    }
})
.patch('/estatus/', async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: bloquear usuario
    // se debe proporcionar el email del usuario a bloquear

    try {
        const response = await Usuario.updateOne(
            {email: req.body.emailUsuario},
            {estatus: ESTATUS_USUARIO.bloqueado}
        );

        let stdres;
        if (response.modifiedCount === 1) stdres = stdRes('ok', 'usuario bloqueado');
        else stdres = stdRes('warn', 'usuario NO bloqueado');

        res.send(stdres);
    }
    catch (err) {
        const msg = `ERROR al bloquear usuario ${req.body.emailUsuario}`;
        console.error(msg, err);
        res.status(500).send(stdRes('error', msg));
    }
});


export type usuarioT = {
    id?: string,
    tipo?: string,
    estatus?: string,
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
