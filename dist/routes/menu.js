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
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const NOTAS_LONG_MAX = 80;
const NOMBRE_LONG_MAX = 40;
const PRECIO_MIN = 0;
const CATEGORIAS = ["ENTRADA", "PLATO FUERTE", "BEBIDA", "POSTRE"];
exports.default = router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario Adimin
        // Obtiene la lista de menu
        try {
            const menu = yield prisma.menu.findMany();
            res.send({
                status: 'ok',
                msg: `menus obtenidos: ${menu.length}`,
                data: menu
            });
        }
        catch (err) {
            // console.error('ERROR al obtener la lista de menú', err);
            res.status(500).send({
                status: 'error',
                msg: 'ERROR al obtener lista de menú'
            });
        }
    });
})
    .get('/:nombre', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuarios: admin y final
        // caso de uso: ver menú cuyo nombre es ':nombre'
        try {
            const menu = yield prisma.menu.findUnique({
                where: {
                    nombre: req.params.nombre
                }
            });
            if (menu) {
                res.send({
                    status: 'ok',
                    data: menu
                });
            }
            else {
                res.send({
                    status: 'warm',
                    msg: `Sin resultados para el menu: ${req.params.nombre}`
                });
            }
        }
        catch (err) {
            // console.error('ERROR al obtener el menú', err);
            res.status(500).send({
                status: 'error',
                msg: 'ERROR al obtener el menú'
            });
        }
    });
})
    .post('/', validaMenu, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario: Admin
        // caso de uso: dar de alta un modificador
        const { categoria, nombre, notas, precio, disponibilidad, modificadores, imagen } = req.body;
        const datos = {
            nombre,
            categoria: categoria.toUpperCase(),
            precio,
            disponibilidad: getBooleanVal(disponibilidad),
        };
        if (notas)
            datos.notas = notas;
        if (modificadores)
            datos.modificadores = modificadores;
        if (imagen)
            datos.imagen = imagen;
        const menu = datos;
        try {
            yield prisma.menu.create({
                data: menu
            });
            res.send({
                status: 'ok'
            });
        }
        catch (err) {
            // console.error('ERROR al insertar modificador', menu.nombre, err);
            res.status(500).send({
                status: 'error',
                msg: 'modificador NO registrado'
            });
        }
    });
})
    .patch('/', validaMenuParaEditar, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // caso de uso: editar un menú
        const { nombre, categoria, notas, precio, disponibilidad, modificadores, imagen } = req.body;
        const menu = {};
        if (disponibilidad)
            menu.disponibilidad = getBooleanVal(disponibilidad);
        if (precio)
            menu.precio = Number.parseFloat(precio);
        if (categoria)
            menu.categoria = categoria;
        if (notas)
            menu.notas = notas;
        if (modificadores)
            menu.modificadores = modificadores;
        if (imagen)
            menu.imagen = imagen;
        try {
            yield prisma.menu.update({
                where: {
                    nombre: nombre
                },
                data: menu
            });
        }
        catch (err) {
            const msg = `ERROR al actualizar menú ${nombre}. ${err.meta.cause}`;
            // console.error(msg, err);
            res.status(500).send({
                status: 'error',
                msg
            });
        }
    });
})
    .delete('/:nombre', validaNombre, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // caso de uso: Eliminar un menú
        try {
            const eliminado = yield prisma.menu.delete({
                where: {
                    nombre: req.params.nombre
                }
            });
            res.send({
                status: 'ok',
                msg: `Menu eliminado ${eliminado.nombre}`
            });
        }
        catch (err) {
            res.status(500).send({
                status: 'error',
                msg: `ERROR. Menu ${req.params.nombre} NO eliminado. ${err.meta.cause}`
            });
        }
    });
})
    .get('/modificadores', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario Admin
        // devuleve la lista de modificadores
        try {
            const modificadores = yield prisma.modificadores.findMany();
            res.send({
                status: 'ok',
                msg: `modificadores obtenidos: ${modificadores.length}`,
                data: modificadores
            });
        }
        catch (err) {
            // console.error('ERROR al obtener todos los usuarios', err);
            res.status(500).send({
                status: 'error',
                msg: 'ERROR al obtener lista de modificadores'
            });
        }
    });
})
    .post('/modificadores', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // caso de uso: dar alta a un modificador
        const { nombre, disponibilidad, precio } = req.body;
        const modificador = {
            nombre,
            disponibilidad: getBooleanVal(disponibilidad),
            precio
        };
        try {
            yield prisma.modificadores.create({
                data: modificador
            });
            res.send({
                status: 'ok'
            });
        }
        catch (err) {
            // console.error('ERROR al insertar modificador', modificador.nombre, err);
            res.status(500).send({
                status: 'error',
                msg: 'modificador NO registrado'
            });
        }
    });
})
    .delete('/modificadores/:nombre', validaModificadorNombre, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // caso de uso: eliminar un modificador
        try {
            const eliminado = yield prisma.modificadores.delete({
                where: {
                    nombre: req.params.nombre
                }
            });
            res.send({
                status: 'ok',
                msg: `Modificador eliminado ${eliminado.nombre}`
            });
        }
        catch (err) {
            res.status(500).send({
                status: 'error',
                msg: `ERROR. Modificador NO eliminado. ${err.meta.cause}`
            });
        }
    });
})
    .patch('/modificadores', validaModificadorParaEditar, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // caso de uso: editar un modificador
        const { nombre, disponibilidad, precio } = req.body;
        const modificador = {};
        if (disponibilidad)
            modificador.disponibilidad = getBooleanVal(disponibilidad);
        if (precio)
            modificador.precio = Number.parseFloat(precio);
        try {
            yield prisma.modificadores.update({
                where: {
                    nombre: nombre
                },
                data: modificador
            });
            res.send({
                status: 'ok',
                msg: 'modificador actualizado'
            });
        }
        catch (err) {
            const msg = `ERROR al actualizar modificador ${nombre}`;
            // console.error(msg, err);
            res.status(500).send({
                status: 'error',
                msg
            });
        }
    });
});
// Funciones Auxiliares  ******************************************************
function validaNombreCategoria(categoria) {
    const index = CATEGORIAS.findIndex(cat => {
        return (cat.toUpperCase() === categoria.toUpperCase());
    });
    return (index > -1);
}
function validaPrecio(_precio) {
    const precio = Number.parseFloat(_precio);
    return (!Number.isNaN(precio) && precio >= PRECIO_MIN);
}
function validaModificadores(modificadores) {
    const valida = (Array.isArray(modificadores) && modificadores.length > 0);
    return valida;
}
function validaDisponibilidad(disponibilidad) {
    return (typeof disponibilidad === 'string' &&
        (disponibilidad.toUpperCase() === 'TRUE' ||
            disponibilidad.toUpperCase() === 'FALSE'));
}
const validaNotas = (notas) => (notas.length <= NOTAS_LONG_MAX);
const getBooleanVal = (val) => (val === 'true');
function validaNombre(req, res, next) {
    if (req.params.nombre)
        return next();
    else {
        res.status(400).send({
            status: 'warn',
            msg: 'Se debe proporcionar el nombre del menú'
        });
    }
}
function validaMenu(req, res, next) {
    const { categoria, nombre, notas, precio, disponibilidad, modificadores, imagen } = req.body;
    if (nombre && nombre.length <= NOMBRE_LONG_MAX &&
        validaNombreCategoria(categoria) &&
        validaPrecio(precio) &&
        validaDisponibilidad(disponibilidad) &&
        (!notas || validaNotas(notas)) &&
        (!modificadores || validaModificadores(modificadores)) &&
        (!imagen || (imagen && imagen.length <= 200))) {
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
function validaMenuParaEditar(req, res, next) {
    const { nombre, categoria, notas, precio, disponibilidad, modificadores, imagen } = req.body;
    if (nombre &&
        (!disponibilidad || validaDisponibilidad(disponibilidad)) &&
        (!categoria || validaNombreCategoria(categoria)) &&
        (!notas || validaNotas(notas)) &&
        (!precio || validaPrecio(precio)) &&
        (!modificadores || validaModificadores(modificadores)) &&
        (!imagen || (imagen && imagen.length <= 200))) {
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
function validaModificadorParaEditar(req, res, next) {
    const { nombre, precio, disponibilidad } = req.body;
    const _precio = Number.parseFloat(precio);
    if (nombre && (disponibilidad ||
        (!Number.isNaN(_precio) && _precio >= PRECIO_MIN))) {
        next();
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: `Datos obligatorios: nombre y (precio >= 0 o disponibilidad)`
        });
    }
}
function validaModificadorNombre(req, res, next) {
    if (req.params.nombre)
        next();
    else {
        res.status(400).send({
            status: 'warn',
            msg: 'Se debe especificar el nombre del modificador'
        });
    }
}
