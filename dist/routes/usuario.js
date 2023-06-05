"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const URL_BASE = 'https://us-east-1.aws.data.mongodb-api.com/app/taco-feliz-uaepm/endpoint/usuarios';
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
exports.default = router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usuarios = yield prisma.usuarios.findMany();
            console.log('USUARIOS', usuarios);
            res.send(usuarios);
        }
        catch (err) {
            console.error('ERROR al obtener todos los usuarios', err);
        }
    });
})
    .post('/', validaUsuario, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario final
        // caso de uso: Registro en aplicación
        const usuario = {
            email: req.body.email,
            tipo: 'USUARIO_FINAL',
            estatus: 'ACTIVO',
            password: req.body.password,
            nombre: req.body.nombre,
            apPaterno: req.body.apPaterno,
            apMaterno: req.body.apMaterno
        };
        try {
            yield prisma.usuarios.create({
                data: usuario
            });
        }
        catch (err) {
            console.error('ERROR al insertar usuario', usuario.email, err);
            res.status(500).send({
                status: 'error',
                msg: 'usuario NO registrado'
            });
        }
        /*
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
        });*/
    });
})
    .patch('/', function (req, res) {
    // caso de uso (usuario admin): bloquear usuario
    // se procede a llamar al endpoint de la base de datos para cancelar al usuario
    // para lo cual se debe proporcionar dos parametros:
    // email del usuario a eliminar y también el usuario del admin
    //  recuerdese que solo el usuario admin puede bloquear usuarios
    axios_1.default.patch(URL_BASE, {
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
function validaUsuario(req, res, next) {
    const nombre = req.body.nombre;
    const apPaterno = req.body.apPaterno;
    const email = req.body.email;
    const password = req.body.password;
    if (nombre && apPaterno && email && password)
        next();
    else
        res.status(400).send({
            status: 'warn',
            msg: 'Los siguientes datos son obligatorios: nombre, apPaterno, correo electronico y contraseña'
        });
}
