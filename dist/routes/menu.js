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
const Menu_1 = require("../models/Menu");
const util_1 = require("../util");
const router = express_1.default.Router();
exports.default = router.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario Adimin
        // Obtiene la lista de menu
        try {
            const menu = yield Menu_1.Menu.find({});
            res.send((0, util_1.stdRes)('ok', `menus obtenidos: ${menu.length}`, menu));
        }
        catch (err) {
            res.status(500).send((0, util_1.stdRes)('error', err.meta.cause));
            throw err;
        }
    });
})
    .get('/:nombre', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuarios: admin y final
        // caso de uso: ver menú cuyo nombre es ':nombre'
        try {
            const menu = yield Menu_1.Menu.findOne({ nombre: req.params.nombre }).exec();
            if (menu)
                res.send((0, util_1.stdRes)('ok', undefined, menu));
            else
                res.send((0, util_1.stdRes)('warn', 'Sin resultados'));
        }
        catch (err) {
            res.status(500).send((0, util_1.stdRes)('error', err.meta.cause));
            throw err;
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
            const response = yield Menu_1.Menu.create(menu);
            console.log('INSERT DOCUMENT MENU ERSPONSE', response);
            res.send((0, util_1.stdRes)('ok', undefined, { id: response._id }));
        }
        catch (err) {
            res.status(500).send((0, util_1.stdRes)('error', err.meta.cause));
            throw err;
        }
    });
})
    .patch('/', validaMenuParaEditar, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // caso de uso: editar un menú
        // para facilitar un poco la lógica de programación, cada menú puede identificarse
        // por su nombre así como por su _id.
        // Para editar un menú hay que especificar el 'nombre' como identificador
        // por lo que al editar un menú no se puede modificar el nombre.
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
            const response = yield Menu_1.Menu.updateOne({ nombre }, menu);
            if (response.modifiedCount === 1)
                res.send((0, util_1.stdRes)('ok'));
            else
                res.status(400).send((0, util_1.stdRes)('warn', 'modificador NO actualizado'));
        }
        catch (err) {
            res.status(500).send((0, util_1.stdRes)('error', err.meta.cause));
            throw err;
        }
    });
})
    .delete('/:nombre', validaNombre, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // usuario admin
        // caso de uso: Eliminar un menú
        try {
            const response = yield Menu_1.Menu.deleteOne({ nombre: req.params.nombre });
            if (response.deletedCount === 1)
                res.send((0, util_1.stdRes)('ok'));
            else
                res.send((0, util_1.stdRes)('warn', 'menu NO eliminado'));
        }
        catch (err) {
            res.status(500).send((0, util_1.stdRes)('error', err.meta.cause));
            throw err;
        }
    });
});
// Funciones Auxiliares  ******************************************************
const NOTAS_LONG_MAX = 80;
const NOMBRE_LONG_MAX = 40;
const PRECIO_MIN = 0;
const CATEGORIAS = ["ENTRADA", "PLATO FUERTE", "BEBIDA", "POSTRE"];
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
        categoria && validaNombreCategoria(categoria) &&
        precio && validaPrecio(precio) &&
        disponibilidad && validaDisponibilidad(disponibilidad) &&
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
