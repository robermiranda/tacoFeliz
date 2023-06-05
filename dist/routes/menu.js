"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { categoria, modificadores, menu } = require('../datos/menu');
const NOTAS_LONG_MAX = 80;
const NOMBRE_LONG_MAX = 40;
const PRECIO_MIN = 0;
exports.default = router.get('/', function (req, res) {
    // devuleve la lista de menú
    // esta acción solo la puede ejecutar el usuario admin
    res.send({
        status: 'ok',
        data: menu
    });
})
    .get('/', function (req, res) {
    // devuleve la lista de modificadores
    // esta acción solo la puede ejecutar el usuario admin
    res.send({
        status: 'ok',
        data: menu
    });
})
    .get('/detalle', function (req, res) {
    // caso de uso (usuario final): ver menú
    const menuResponse = menu.map((_menu) => {
        const categoriaDesc = categoria[_menu.categoria];
        const modificadoresDesc = _menu.modificadores.map((modificadorId) => {
            return modificadores.find((modificador) => modificador.id === modificadorId);
        });
        return Object.assign(Object.assign({}, _menu), { categoria: categoriaDesc, modificadores: modificadoresDesc });
    });
    res.send({
        status: 'ok',
        data: menuResponse
    });
})
    .post('/', validaMenu, function (req, res) {
    // caso de uso (usuario admin): dar de alta un modificador
    const { categoria, nombre, notas, precio, disponibilidad, modificadores, imagen } = req.body;
    // se procede a enviar a la db el nuevo menú
    // Se delega a la db validar la existencia de los modificadores y la validación de las categorias
    res.send({
        status: 'ok',
        msg: 'menu agregado',
        data: {
            categoria, nombre, notas, precio, disponibilidad, modificadores, imagen
        }
    });
})
    .patch('/', validaMenuParaEditar, function (req, res) {
    // caso de uso (usuario admin): editar un menú
    const { menuId, categoria, nombre, notas, precio, disponibilidad, modificadores, imagen } = req.body;
    // se procede a enviar a la db los datos para editar el menú
    // se da a la db la responsabilidad de verificar que existe menú para id = menuId
    res.send({
        status: 'ok',
        msg: 'modificador agregado',
        data: {
            menuId, categoria, nombre, notas, precio, disponibilidad, modificadores, imagen
        }
    });
})
    .delete('/:menuId', validaMenuId, function (req, res) {
    // caso de uso (usuario admin): eliminar un menú
    // se procede a enviar la peticion a la db
    res.send({
        status: 'ok',
        msg: 'menú eliminado',
        data: req.params.menuId
    });
})
    .get('/modificadores', function (req, res) {
    // devuleve la lista de modificadores
    // esta acción solo la puede ejecutar el usuario admin
    res.send({
        status: 'ok',
        data: modificadores
    });
})
    .post('/modificadores', validaModificador, function (req, res) {
    // caso de uso (usuario admin): dar de alta un modificador
    const nombre = req.body.nombre;
    const precio = Number.parseFloat(req.body.precio);
    const disponibilidad = req.body.disponibilidad;
    // se procede a enviar a la db el nuevo modificador
    res.send({
        status: 'ok',
        msg: 'modificador agregado',
        data: {
            nombre, precio, disponibilidad
        }
    });
})
    .delete('/modificadores/:modificadorId', validaModificadorId, function (req, res) {
    // caso de uso (usuario admin): eliminar un modificador
    // se procede a enviar la peticion a la db
    res.send({
        status: 'ok',
        msg: 'modificador eliminado',
        data: req.params.modificadorId
    });
})
    .patch('/modificadores', validaModificadorParaEditar, function (req, res) {
    // caso de uso (usuario admin): editar un modificador
    const modificadorId = req.body.modificadorId;
    const nombre = req.body.nombre;
    const precio = Number.parseFloat(req.body.precio);
    const disponibilidad = req.body.disponibilidad;
    // se procede a enviar a la db el nuevo modificador
    // se da a la db la responsabilidad de verificar que existe modificador para id = modificadorId
    res.send({
        status: 'ok',
        msg: 'modificador agregado',
        data: {
            modificadorId, nombre, precio, disponibilidad
        }
    });
});
// Funciones Auxiliares  ******************************************************
function validaModificador(req, res, next) {
    const { nombre, precio, disponibilidad } = req.body;
    const _precio = Number.parseFloat(precio);
    if (disponibilidad &&
        nombre &&
        nombre.length <= NOMBRE_LONG_MAX &&
        _precio &&
        !Number.isNaN(_precio) &&
        _precio >= PRECIO_MIN) {
        next();
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: `Son obligatorios los datos: nombre.length <= ${NOMBRE_LONG_MAX}, precio > ${PRECIO_MIN} y disponibilidad`
        });
    }
}
function validaMenu(req, res, next) {
    const { categoria, nombre, notas, precio, disponibilidad, modificadores } = req.body;
    const _precio = Number.parseFloat(precio);
    if (categoria &&
        disponibilidad &&
        nombre &&
        nombre.length <= NOMBRE_LONG_MAX &&
        _precio &&
        !Number.isNaN(_precio) &&
        _precio >= PRECIO_MIN &&
        (!notas || (notas && notas.length <= NOTAS_LONG_MAX)) &&
        (!modificadores || (Array.isArray(modificadores) && modificadores.length > 0))) {
        next();
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: `Son obligatorios los datos:
            nombre.length <= ${NOMBRE_LONG_MAX},
            precio > ${PRECIO_MIN},
            disponibilidad,
            lista de modificadores validos,
            categoria`
        });
    }
}
function validaModificadorParaEditar(req, res, next) {
    const { modificadorId, nombre, precio, disponibilidad } = req.body;
    const _precio = Number.parseFloat(precio);
    if ((nombre || _precio || disponibilidad) &&
        modificadorId &&
        (!nombre || nombre.length <= NOMBRE_LONG_MAX) &&
        (!precio || (!Number.isNaN(_precio) && _precio >= PRECIO_MIN))) {
        next();
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: `El modificadorId es obligatorio y almenos uno de los siguientes datos son obligatorios: nombre.length <= ${NOMBRE_LONG_MAX}, precio > ${PRECIO_MIN} y disponibilidad`
        });
    }
}
function validaMenuParaEditar(req, res, next) {
    const { menuId, categoria, nombre, notas, precio, disponibilidad, modificadores } = req.body;
    const _precio = Number.parseFloat(precio);
    if ((categoria || disponibilidad || nombre || _precio || notas || modificadores) &&
        menuId &&
        (!precio || (!Number.isNaN(_precio) && _precio >= PRECIO_MIN)) &&
        (!notas || notas.length <= NOTAS_LONG_MAX) &&
        (!modificadores || (Array.isArray(modificadores) && modificadores.length > 0))) {
        next();
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: `Almenos uno de los siguientes datos son obligatorios:
            nombre.length <= ${NOMBRE_LONG_MAX},
            precio > ${PRECIO_MIN},
            disponibilidad,
            lista de modificadores validos,
            categoria`
        });
    }
}
function validaModificadorId(req, res, next) {
    if (!req.params.modificadorId) {
        res.status(400).send({
            status: 'warn',
            msg: 'Se debe especificar el id del modificador'
        });
    }
    else {
        const index = modificadores.findIndex((modificador) => {
            return (modificador.id === req.params.modificadorId);
        });
        if (index > -1)
            next();
        else {
            res.status(400).send({
                status: 'warn',
                msg: 'Modificador NO encontrado'
            });
        }
    }
}
function validaMenuId(req, res, next) {
    if (!req.params.menuId) {
        res.status(400).send({
            status: 'warn',
            msg: 'Se debe especificar el id del menu'
        });
    }
    else {
        const index = menu.findIndex((_menu) => {
            return (_menu.id === req.params.menuId);
        });
        if (index > -1)
            next();
        else {
            res.status(400).send({
                status: 'warn',
                msg: 'Menú NO encontrado'
            });
        }
    }
}
