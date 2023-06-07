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
const Usuario_1 = require("../models/Usuario");
const util_1 = require("../util");
const router = express_1.default.Router();
exports.default = router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // obtiene la lista de usuarios
        try {
            const usuarios = yield Usuario_1.Usuario.find({});
            res.send((0, util_1.stdRes)('ok', `usuarios obtenidos: ${usuarios.length}`, usuarios));
        }
        catch (err) {
            res.status(500).send((0, util_1.stdRes)('error', 'ERROR al obtener los usuarios'));
        }
    });
})
    .post('/', validaUsuario, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario final
        // caso de uso: Registro en aplicación
        const usuario = {
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password,
        };
        if (req.body.apPaterno)
            usuario.apPaterno = req.body.apPaterno;
        if (req.body.apMaterno)
            usuario.apMaterno = req.body.apMaterno;
        try {
            const _usuario = yield Usuario_1.Usuario.create(usuario);
            res.send((0, util_1.stdRes)('ok', `usuario creado con id: ${_usuario._id}`));
        }
        catch (err) {
            console.error('ERROR al insertar usuario', usuario.email, err);
            res.status(500).send((0, util_1.stdRes)('error', 'usuario NO registrado'));
        }
    });
})
    .patch('/estatus/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // caso de uso: bloquear usuario
        // se debe proporcionar el email del usuario a bloquear
        try {
            const response = yield Usuario_1.Usuario.updateOne({ email: req.body.emailUsuario }, { estatus: Usuario_1.ESTATUS_USUARIO.bloqueado });
            let stdres;
            if (response.modifiedCount === 1)
                stdres = (0, util_1.stdRes)('ok', 'usuario bloqueado');
            else
                stdres = (0, util_1.stdRes)('warn', 'usuario NO bloqueado');
            res.send(stdres);
        }
        catch (err) {
            const msg = `ERROR al bloquear usuario ${req.body.emailUsuario}`;
            console.error(msg, err);
            res.status(500).send((0, util_1.stdRes)('error', msg));
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
