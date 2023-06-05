"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menu = exports.modificadores = exports.categoria = void 0;
exports.categoria = {
    1: 'entrada',
    2: 'plato fuerte',
    3: 'postre',
    4: 'bebida',
};
exports.modificadores = [
    {
        id: 'mod-m1-1',
        nombre: 'queso extra',
        precio: 20.00,
        disponibilidad: true
    },
    {
        id: 'mod-m1-2',
        nombre: 'adereso extra',
        precio: 10.00,
        disponibilidad: false
    },
    {
        id: 'mod-m2-1',
        nombre: 'salsa roja',
        precio: 0,
        disponibilidad: true
    },
    {
        id: 'mod-m2-2',
        nombre: 'salsa verde',
        precio: 0,
        disponibilidad: false
    },
    {
        id: 'mod-m3-1',
        nombre: 'con lechera',
        precio: 5.00,
        disponibilidad: true
    },
    {
        id: 'mod-m3-2',
        nombre: 'con chispas de chocolate',
        precio: 10.00,
        disponibilidad: true
    },
    {
        id: 'mod-m4-1',
        nombre: 'agua de limón',
        precio: 0,
        disponibilidad: true
    },
    {
        id: 'mod-m4-2',
        nombre: 'agua de naranja',
        precio: 0,
        disponibilidad: true
    },
    {
        id: 'mod-m5-1',
        nombre: 'coca cola',
        precio: 0,
        disponibilidad: true
    },
    {
        id: 'mod-m5-2',
        nombre: 'sidral mundet',
        precio: 0,
        disponibilidad: false
    },
];
exports.menu = [
    {
        id: 'menu-1',
        categoria: 1,
        nombre: 'trio de quekas',
        notas: 'Orden de tres quesadillas con tortilla',
        precio: 40.00,
        disponibilidad: true,
        modificadores: ['mod-m1-1', 'mod-m1-2'],
        imagen: ''
    },
    {
        id: 'menu-2',
        categoria: 2,
        nombre: 'Enchiladas',
        notas: 'Orden de tres enchiladas',
        precio: 140.00,
        disponibilidad: true,
        modificadores: ['mod-m2-1'],
        imagen: ''
    },
    {
        id: 'menu-3',
        categoria: 3,
        nombre: 'fresas con crema',
        notas: 'vaso mediano de fresas',
        precio: 35.00,
        disponibilidad: true,
        modificadores: ['mod-m3-1'],
        imagen: ''
    },
    {
        id: 'menu-4',
        categoria: 4,
        nombre: 'agua de sabor',
        notas: 'vaso de 1/2 litro',
        precio: 25.00,
        disponibilidad: true,
        modificadores: ['mod-m4-1', 'mod-m4-2'],
        imagen: ''
    },
    {
        id: 'menu-5',
        categoria: 4,
        nombre: 'lata refresco',
        notas: 'lata de 1/2 litro',
        precio: 20.00,
        disponibilidad: false,
        modificadores: ['mod-m5-1', 'mod-m5-2'],
        imagen: ''
    },
];
