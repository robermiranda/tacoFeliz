"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarios = exports.estatusUsuario = exports.tipoUsuario = void 0;
exports.tipoUsuario = new Map([
    ['1', 'super admin'],
    ['2', 'final']
]);
exports.estatusUsuario = new Map([
    ['1', 'activo'],
    ['2', 'bloqueado']
]);
exports.usuarios = [
    {
        tipo: '1',
        estatus: '1',
        nombre: 'Federico',
        apPaterno: 'Fernandez',
        apMaterno: 'Figueroa',
        email: 'fer.fernandez@gmail.com',
        password: '567',
    },
    {
        tipo: '2',
        estatus: '1',
        nombre: 'Juan',
        apPaterno: 'Pérez',
        apMaterno: 'Mejía',
        email: 'juan.perez@gmail.com',
        password: '123'
    },
    {
        tipo: '2',
        estatus: '2',
        nombre: 'Armando',
        apPaterno: 'Álvarez',
        apMaterno: 'Alarcon',
        email: 'alvaro.alvarez@gmail.com',
        password: '456'
    },
];
