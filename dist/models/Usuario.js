"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = exports.ESTATUS_USUARIO = exports.TIPO_USUARIO = void 0;
const mongoose_1 = require("mongoose");
exports.TIPO_USUARIO = {
    final: 'USUARIO_FINAL',
    admin: 'SUPER_ADMIN'
};
exports.ESTATUS_USUARIO = {
    activo: 'ACTIVO',
    bloqueado: 'BLOQUEADO'
};
const usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        maxLength: 40,
        required: true,
    },
    apPaterno: {
        type: String,
        maxLength: 40
    },
    apMaterno: {
        type: String,
        maxLength: 40
    },
    email: {
        type: String,
        required: true,
        maxLength: 40,
        index: true,
        unique: true
    },
    password: {
        required: true,
        type: String,
        maxLength: 40
    },
    estatus: {
        type: String,
        required: true,
        default: exports.ESTATUS_USUARIO.activo,
        maxLength: 20
    },
    tipo: {
        type: String,
        required: true,
        default: exports.TIPO_USUARIO.final,
        maxLength: 20
    }
}, { versionKey: false });
exports.Usuario = (0, mongoose_1.model)("Usuario", usuarioSchema);
