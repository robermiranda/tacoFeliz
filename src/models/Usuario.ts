import { Schema, model } from "mongoose";

export const TIPO_USUARIO = {
    final: 'USUARIO_FINAL',
    admin: 'SUPER_ADMIN'
}

export const ESTATUS_USUARIO = {
    activo: 'ACTIVO',
    bloqueado: 'BLOQUEADO'
}

const usuarioSchema = new Schema({
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
        default: ESTATUS_USUARIO.activo,
        maxLength: 20
    },
    tipo: {
        type: String,
        required: true,
        default: TIPO_USUARIO.final,
        maxLength: 20
    }
}, {versionKey: false});

export const Usuario = model ("Usuario", usuarioSchema);
