import { Schema, model } from "mongoose";

export type tipoUsuarioT = 'USUARIO_FINAL' | 'SUPER_ADMIN';

export type estatusUsuarioT = 'ACTIVO' | 'BLOQUEADO';

export const ESTATUS_USUARIO = {
    activo: 'ACTIVO',
    bloqueado: 'BLOQUEADO'
}

export const TIPO_USUARIO = {
    final: 'USUARIO_FINAL',
    admin: 'SUPER_ADMIN'
}

export interface usuarioI {
    nombre: string,
    apPaterno?: string,
    apMaterno?: string,
    estatus: estatusUsuarioT,
    tipo: tipoUsuarioT,
    email: string,
    password: string
}

const usuarioSchema = new Schema<usuarioI>({
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
        default: 'ACTIVO',
        maxLength: 20
    },
    tipo: {
        type: String,
        required: true,
        default: 'USUARIO_FINAL',
        maxLength: 20
    }
}, {versionKey: false});

export const Usuario = model<usuarioI> ("Usuario", usuarioSchema);
