import express, { Request, Response } from 'express';
import { Usuario } from '../domain/Usuario';
import { stdRes } from '../util';
import { validaUsuario } from '../validators/usuario';
import { throwError } from '../util';

const router = express.Router();

export default router.get('/', async function (req: Request, res: Response) {
    // usuario admin
    // obtiene la lista de usuarios
    
    try {
        const usuarios = await Usuario.getUsuarios();
        res.send(stdRes('ok', `usuarios obtenidos: ${usuarios.length}`, usuarios));
    }
    catch (err) { throwError(err, res) }
})
.post('/', validaUsuario, async function (req: Request, res: Response) {
    // usuario final
    // caso de uso: Registro en aplicación

    const apellidos: any = {}

    if (req.body.apPaterno) apellidos.apPaterno = req.body.apPaterno;
    if (req.body.apMaterno) apellidos.apMaterno = req.body.apMaterno;

    try {
        const usuario = new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password,
            ...apellidos
        });

        const id = await usuario.create();
        if (id) res.send(stdRes('ok', `usuario creado con id: ${id}`, {id}));
        else res.status(400).send(stdRes('warn', 'usuario NO creado'));
    }
    catch (err) {
        throwError(err, res, `ERROR al crear usuario para el email: ${req.body.email}`);
    }
})
.patch('/estatus/', async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: bloquear usuario
    // se debe proporcionar el email del usuario a bloquear

    try {

        const usuario = new Usuario ({ email: req.body.emailUsuario });
        const bloqueado = await usuario.bloquear();

        if (bloqueado === 1) res.send(stdRes('ok', 'usuario bloqueado'));
        else res.status(400).send(stdRes('warn', 'usuario NO bloqueado'));
    }
    catch (err) {
        const msg = `ERROR al bloquear usuario ${req.body.emailUsuario}`;
        throwError (err, res, msg);
    }
});
