"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sesiones = exports.tiempoExpiracionSesion = void 0;
exports.tiempoExpiracionSesion = 300000;
exports.sesiones = [
    {
        id: 'ses-1',
        usuarioId: 'usu-1',
        // conviene guardar la hora como timestamp
        // para facilitar el calculo de expiración de la sesion 
        // 5 minutos = 300 segundos = 300,000 milisegundos
        hora: '',
        datos: {
        // usuario
        // orden
        }
    }
];
