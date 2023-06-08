import express, { NextFunction, Request, Response } from 'express';
import { Menu } from '../models/Menu';
import { stdRes, throwError } from '../util';

const router = express.Router();

export default router.get('/', async function (req: Request, res: Response) {
    // usuario Adimin
    // Obtiene la lista de menu

    try {
        const menu = await Menu.find({});
        res.send(stdRes('ok', `menus obtenidos: ${menu.length}`, menu));
    }
    catch (err: any) { throwError(err, res) }
})
.get('/:nombre', async function (req: Request, res: Response) {
    // usuarios: admin y final
    // caso de uso: ver menú cuyo nombre es ':nombre'
    
    try {
        const menu = await Menu.findOne({nombre: req.params.nombre}).exec();

        if (menu) res.send(stdRes('ok', undefined, menu));
        else res.send(stdRes('warn', 'Sin resultados'));
    }
    catch (err: any) { throwError(err, res) }
})
.post('/', validaMenu, async function (req: Request, res: Response) {
    // usuario: Admin
    // caso de uso: dar de alta un modificador

    const {categoria, nombre, notas, precio, disponibilidad, modificadores, imagen} = req.body;

    const datos: any = {
        nombre,
        categoria: categoria.toUpperCase(),
        precio,
        disponibilidad: getBooleanVal(disponibilidad),
    }

    if (notas) datos.notas = notas;
    if (modificadores) datos.modificadores = modificadores;
    if (imagen) datos.imagen = imagen;

    const menu: menuT = datos;

    try {
        const response = await Menu.create(menu);
        res.send(stdRes('ok', undefined, {id: response._id}));
    }
    catch (err: any) { throwError(err, res) }
})
.patch('/', validaMenuParaEditar, async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: editar un menú

    // para facilitar un poco la lógica de programación, cada menú puede identificarse
    // por su nombre así como por su _id.
    // Para editar un menú hay que especificar el 'nombre' como identificador
    // por lo que al editar un menú no se puede modificar el nombre.

    const {nombre, categoria, notas, precio, disponibilidad, modificadores, imagen} = req.body;
    const menu: any = {}

    if (disponibilidad) menu.disponibilidad = getBooleanVal(disponibilidad);
    if (precio) menu.precio = Number.parseFloat(precio);
    if (categoria) menu.categoria = categoria;
    if (notas) menu.notas = notas;
    if (modificadores) menu.modificadores = modificadores;
    if (imagen) menu.imagen = imagen;

    try {
        const response = await Menu.updateOne({nombre}, menu);
        if (response.modifiedCount === 1) res.send(stdRes('ok'));
        else res.status(400).send(stdRes('warn', 'modificador NO actualizado'));
    }
    catch (err: any) { throwError(err, res) }
})
.delete('/:nombre', validaNombre, async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: Eliminar un menú

    try {
        const response = await Menu.deleteOne({nombre: req.params.nombre});
        if (response.deletedCount === 1) res.send(stdRes('ok'));
        else res.send(stdRes('warn', 'menu NO eliminado'));
    }
    catch (err: any) { throwError(err, res) }
})

// Declaración de tipos  ******************************************************

type menuT = {
    id?:            string,
    categoria:      string,
    nombre:         string,
    notas?:         string,
    precio:         number,
    disponibilidad: boolean,
    modificadores?: any,
    imagen?:        string
}

// Funciones Auxiliares  ******************************************************

const NOTAS_LONG_MAX: number = 80;
const NOMBRE_LONG_MAX: number = 40;
const PRECIO_MIN: number = 0;
const CATEGORIAS: string[] = ["ENTRADA", "PLATO FUERTE", "BEBIDA", "POSTRE"];

function validaNombreCategoria (categoria: string) {
    const index = CATEGORIAS.findIndex(cat => {
        return (cat.toUpperCase() === categoria.toUpperCase());
    });

    return (index > -1);
}

function validaPrecio (_precio: string) {
    const precio = Number.parseFloat(_precio);
    return ( ! Number.isNaN(precio) && precio >= PRECIO_MIN);
}

function validaModificadores (modificadores: string[]) {
    const valida = (Array.isArray(modificadores) && modificadores.length > 0);
    return valida;
}

function validaDisponibilidad (disponibilidad: string) {
    return (typeof disponibilidad === 'string' &&
        (disponibilidad.toUpperCase() === 'TRUE' ||
        disponibilidad.toUpperCase() === 'FALSE'));
}

const validaNotas =(notas: string) => (notas.length <= NOTAS_LONG_MAX);

const getBooleanVal = (val: string) => (val === 'true');

function validaNombre (req: Request, res: Response, next: NextFunction) {
    if (req.params.nombre) return next();
    else {
        res.status(400).send({
            status: 'warn',
            msg: 'Se debe proporcionar el nombre del menú'
        });
    }
}

function validaMenu (req: Request, res: Response, next: NextFunction) {
    const {categoria, nombre, notas, precio, disponibilidad, modificadores, imagen} = req.body;

    if (nombre && nombre.length <= NOMBRE_LONG_MAX &&
        categoria && validaNombreCategoria(categoria) &&
        precio && validaPrecio(precio) &&
        disponibilidad && validaDisponibilidad(disponibilidad) &&
        ( ! notas || validaNotas(notas)) &&
        ( ! modificadores || validaModificadores(modificadores)) &&
        ( ! imagen || (imagen && imagen.length <= 200))) {

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

function validaMenuParaEditar (req: Request, res: Response, next: NextFunction) {

    const {nombre, categoria, notas, precio, disponibilidad, modificadores, imagen} = req.body;

    if (nombre &&
        ( ! disponibilidad || validaDisponibilidad(disponibilidad)) &&
        ( ! categoria || validaNombreCategoria(categoria)) &&
        ( ! notas || validaNotas(notas)) &&
        ( ! precio || validaPrecio(precio)) &&
        ( ! modificadores || validaModificadores(modificadores)) &&
        ( ! imagen || (imagen && imagen.length <= 200))) {

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
