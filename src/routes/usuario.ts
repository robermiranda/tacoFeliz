import express, { NextFunction, Request, Response } from 'express';
import { usuarios, tipoUsuario, estatusUsuario } from '../datos/usuario';

function validaUsuario (req: Request, res: Response, next: NextFunction) {
    const nombre: string = req.body.nombre;
    const apPaterno: string = req.body.apPaterno;
    const apMaterno: string = req.body.apMaterno;
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (nombre && email && password) next();
    else res.status(400).send({
        status: 'warn',
        msg: 'Los siguientes datos son obligatorios: nombre, correo electronico y contraseña'
    });
}

const router = express.Router();

function validaUsuarioEmail (req: Request, res: Response, next: NextFunction) {
    
    if ( ! req.params.usuarioEmail) {
        res.status(400).send({
            status: 'warn',
            msg: 'Se debe especificar el email del usuario'
        });
    }
    else {
        const index: number = usuarios.findIndex((usuario: usuarioT) => usuario.email === req.params.usuarioEmail);
        if (index > -1) next();
        else {
            res.status(400).send({
                status: 'warn',
                msg: 'usuario NO encontrado'
            });    
        }
    }   
}

export default router.get('/', function (req: Request, res: Response) {
    
    const usuarioResponse: usuarioT[] = usuarios.map((usuario: usuarioT) => {

        const tipo: string | undefined = tipoUsuario.get(usuario.tipo);
        const estatus: string | undefined = estatusUsuario.get(usuario.estatus);

        if (tipo && estatus) return {
            ...usuario,
            tipo,
            estatus,
        }

        return usuario;
    });
    
    res.send(usuarioResponse);
})
.post('/', validaUsuario, function (req: Request, res: Response) {
    // Caso de uso: Rregistro en aplicación
    const nombre: string = req.body.nombre;
    const apPaterno: string = req.body.apPaterno;
    const apMaterno: string = req.body.apMaterno;
    const email: string = req.body.email;
    const password: string = req.body.password;

    // Se procede a registrar el usuario
    const usuarioResponse: usuarioT = {
        id: 'user-123',
        tipo: '2',
        estatus: 'activo',
        nombre,
        apPaterno,
        apMaterno,
        email,
        password: '*****'
    }

    res.send({
        status: 'ok',
        msg: 'usuario registrado',
        data: {
            usuarioEstatus: 'activo'
        }
    });
})
.delete('/:usuarioEmail', validaUsuarioEmail, function (req: Request, res: Response) {
    // caso de uso (usuario admin): bloquear usuario

    // se procede a llamar al endpoint de la base de datos para cancelar al usuario
    // para lo cual se debe proporcionar dos parametros:
    // email del usuario a eliminar y también el usuario del admin
    //  recuerdese que solo el usuario admin puede bloquear usuarios

    res.send({
        status: 'ok',
        msg: 'se procede a bloquear al usuario'
    });
});

export type usuarioT = {
    id?: string,
    tipo: string,
    estatus: string,
    nombre: string,
    apPaterno: string,
    apMaterno: string,
    email: string,
    password: string
}

export type tipoUsuarioT = string;