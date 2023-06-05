"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordenes = void 0;
exports.ordenes = [
    {
        id: 'ord-1',
        usuario: 'usu-1',
        menu: ['menu-1', 'menu-4'],
        modificadores: ['mod-m1-1', 'mod-m1-2', 'mod-m4-1'],
        // hora servicio: 10 HRS. - 18 HRS
        hora: '',
        estatus: '1',
        costo: {
            totalPlatillos: 150.00,
            totalModificadores: 40.00,
            subTotal: 190.00,
            propina: 19.00,
            total: 209.00
        },
        direccionEnvio: 'Av. Juarez No. 17 Col. San Juan del Tepeyac',
        metodoPago: '1'
    },
    {
        id: 'ord-2',
        usuario: 'usu-2',
        menu: ['menu-2', 'menu-3'],
        modificadores: ['mod-m2-1', 'mod-m2-2', 'mod-m3-1'],
        // hora servicio: 10 HRS. - 18 HRS
        hora: '',
        estatus: '3',
        costo: {
            totalPlatillos: 150.00,
            totalModificadores: 40.00,
            subTotal: 190.00,
            propina: 19.00,
            total: 209.00
        },
        direccionEnvio: 'Av. Cuitlahuac No. 27 Col. San Andrés',
        metodoPago: '1'
    },
];
