"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sesion_1 = require("../datos/sesion");
const usuario_1 = require("../datos/usuario");
const router = express_1.default.Router();
function preValidaCredenciales(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password)
        next();
    else
        res.status(400).send({
            status: 'warn',
            msg: 'Los siguientes datos son obligatorios: correo electronico y contraseña'
        });
}
router.get('/', function (req, res) {
    res.send({
        status: 'ok',
        data: sesion_1.sesiones,
    });
})
    .post('/', preValidaCredenciales, function (req, res) {
    // caso de uso: Iniciar sesion
    const usuario = usuario_1.usuarios.find((usuario) => {
        return usuario.email === req.body.email;
    });
    if (!usuario) {
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
            const sesionId = '123opq';
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
exports.default = router;
