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
const client_1 = require("@prisma/client");
const TIPO_USUARIO = {
    final: 'FINAL',
    admin: 'SUPER_ADMIN'
};
const ESTATUS = {
    activo: 'ACTIVO',
    bloquedao: 'BLOQUEADO'
};
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
exports.default = router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usuarios = yield prisma.usuarios.findMany();
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
    });
})
    .post('/', validaUsuario, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario final
        // caso de uso: Registro en aplicación
        const usuario = {
            email: req.body.email,
            tipo: TIPO_USUARIO.final,
            estatus: ESTATUS.activo,
            password: req.body.password,
            nombre: req.body.nombre,
        };
        if (req.body.apPaterno)
            usuario.apPaterno = req.body.apPaterno;
        if (req.body.apMaterno)
            usuario.apMaterno = req.body.apMaterno;
        try {
            yield prisma.usuarios.create({
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
    });
})
    .patch('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // caso de uso (usuario admin): bloquear usuario
        // se procede a llamar al endpoint de la base de datos para cancelar al usuario
        // para lo cual se debe proporcionar dos parametros:
        // email del usuario a eliminar: emailUsuario
        // recuerdese que solo el usuario admin puede bloquear usuarios
        try {
            const bloqueado = yield prisma.usuarios.update({
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
});
function validaUsuario(req, res, next) {
    const LENGTH = 40;
    const { nombre, apPaterno, email, password } = req.body;
    if (nombre && nombre.length <= LENGTH &&
        apPaterno && apPaterno.length <= LENGTH &&
        email && email.length <= LENGTH &&
        password && password.length <= LENGTH) {
        next();
    }
    else
        res.status(400).send({
            status: 'warn',
            msg: 'Los siguientes datos son obligatorios: nombre, apPaterno, correo electronico y contraseña'
        });
}
