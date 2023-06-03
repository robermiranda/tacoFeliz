import express, { NextFunction, Request, Response } from 'express';
import { usuarios, tipoUsuario, estatusUsuario } from '../datos/usuario';
import axios from 'axios';


const router = express.Router();
const URL_BASE = 'https://us-east-1.aws.data.mongodb-api.com/app/taco-feliz-uaepm/endpoint/usuarios';

export default router.get('/', function (req: Request, res: Response) {
    axios(URL_BASE)
    .then(usuarios => {
        res.send(usuarios.data);
    })
    .catch(err => {
        console.error('ERROR al obtener los usuarios', err.message);
        res.status(500).send({
            status: 'error',
            msg: 'ERROR al obtener los usuarios'
        })
    });
})
.post('/', validaUsuario, function (req: Request, res: Response) {
    
    axios.post(URL_BASE, {
        nombre: req.body.nombre,
        apPaterno: req.body.apPaterno,
        apMaterno: req.body.apMaterno,
        email:  req.body.email,
        password: req.body.password    
    })
    .then(response => {
        res.send(response.data);
    })
    .catch(err => {
        console.error('ERROR al registrar usuario', req.body.nombre);
        res.status(500).send({
            status: 'error',
            msg: 'usuario NO registrado'
        });
    });
})
.patch('/', function (req: Request, res: Response) {
    // caso de uso (usuario admin): bloquear usuario

    // se procede a llamar al endpoint de la base de datos para cancelar al usuario
    // para lo cual se debe proporcionar dos parametros:
    // email del usuario a eliminar y también el usuario del admin
    //  recuerdese que solo el usuario admin puede bloquear usuarios
    axios.patch(URL_BASE, {
        emailUsuario: req.body.emailUsuario,
        emailAdmin: req.body.emailAdmin
    })
    .then(response => {
        res.send(response.data);
    })
    .catch(err => {
        console.error('ERROR al bloquear usuario', req.body.nombre);
        res.status(500).send({
            status: 'error',
            msg: 'usuario NO bloqueado'
        });
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


function validaUsuario (req: Request, res: Response, next: NextFunction) {
    const nombre: string = req.body.nombre;
    const apPaterno: string = req.body.apPaterno;
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (nombre && apPaterno && email && password) next();
    else res.status(400).send({
        status: 'warn',
        msg: 'Los siguientes datos son obligatorios: nombre, apPaterno, correo electronico y contraseña'
    });
}

