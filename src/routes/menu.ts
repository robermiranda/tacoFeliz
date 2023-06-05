import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const router = express.Router();
const prisma = new PrismaClient();

const NOTAS_LONG_MAX: number = 80;
const NOMBRE_LONG_MAX: number = 40;
const PRECIO_MIN: number = 0;
const CATEGORIAS: string[] = ["ENTRADA", "PLATO FUERTE", "BEBIDA", "POSTRE"];


export default router.get('/', async function (req: Request, res: Response) {
    // usuario Adimin
    // Obtiene la lista de menu

    try {
        const menu = await prisma.menu.findMany();
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
})
.get('/:nombre', async function (req: Request, res: Response) {
    // usuarios: admin y final
    // caso de uso: ver menú cuyo nombre es ':nombre'
    
    try {
        const menu = await prisma.menu.findUnique({
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
        await prisma.menu.create({
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


})
.patch('/', validaMenuParaEditar, async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: editar un menú

    const {nombre, categoria, notas, precio, disponibilidad, modificadores, imagen} = req.body;
    const menu: any = {}

    if (disponibilidad) menu.disponibilidad = getBooleanVal(disponibilidad);
    if (precio) menu.precio = Number.parseFloat(precio);
    if (categoria) menu.categoria = categoria;
    if (notas) menu.notas = notas;
    if (modificadores) menu.modificadores = modificadores;
    if (imagen) menu.imagen = imagen;

    try {
        await prisma.menu.update({
            where: {
                nombre: nombre
            },
            data: menu
        });
    }
    catch (err: any) {
        const msg = `ERROR al actualizar menú ${nombre}. ${err.meta.cause}`;
        // console.error(msg, err);
        res.status(500).send({
            status: 'error',
            msg
        });
    }
})
.delete('/:nombre', validaNombre, async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: Eliminar un menú

    try {
        const eliminado = await prisma.menu.delete({
            where: {
                nombre: req.params.nombre
            }
        });

        res.send({
            status: 'ok',
            msg: `Menu eliminado ${eliminado.nombre}`
        });
    }
    catch (err: any) {
        res.status(500).send({
            status: 'error',
            msg: `ERROR. Menu ${req.params.nombre} NO eliminado. ${err.meta.cause}`
        });
    }
})
.get('/modificadores', async function (req: Request, res: Response) {
    // usuario Admin
    // devuleve la lista de modificadores

    try {
        const modificadores = await prisma.modificadores.findMany();
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
})
.post('/modificadores', async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: dar alta a un modificador

    const { nombre, disponibilidad, precio } = req.body;

    const modificador: modificadorT = {
        nombre,
        disponibilidad: getBooleanVal(disponibilidad),
        precio
    }

    try {
        await prisma.modificadores.create({
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
})
.delete('/modificadores/:nombre', validaModificadorNombre, async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: eliminar un modificador

    try {
        const eliminado = await prisma.modificadores.delete({
            where: {
                nombre: req.params.nombre
            }
        });

        res.send({
            status: 'ok',
            msg: `Modificador eliminado ${eliminado.nombre}`
        });
    }
    catch (err: any) {
        res.status(500).send({
            status: 'error',
            msg: `ERROR. Modificador NO eliminado. ${err.meta.cause}`
        });
    }
})
.patch('/modificadores', validaModificadorParaEditar, async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: editar un modificador

    const { nombre, disponibilidad, precio } = req.body;
    const modificador: any = {}

    if (disponibilidad) modificador.disponibilidad = getBooleanVal(disponibilidad);
    if (precio) modificador.precio = Number.parseFloat(precio);

    try {
        await prisma.modificadores.update({
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

// Declaración de tipos  ******************************************************

type modificadorT = {
    id?: string,
    nombre: string,
    precio: number,
    disponibilidad: boolean
}

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
        validaNombreCategoria(categoria) &&
        validaPrecio(precio) &&
        validaDisponibilidad(disponibilidad) &&
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

function validaModificadorParaEditar (req: Request, res: Response, next: NextFunction) {
    const {nombre, precio, disponibilidad} = req.body;
    const _precio = Number.parseFloat(precio);

    if (nombre && (disponibilidad ||
        ( ! Number.isNaN(_precio) && _precio >= PRECIO_MIN))) {
    
        next();
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: `Datos obligatorios: nombre y (precio >= 0 o disponibilidad)`
        });
    }
}

function validaModificadorNombre (req: Request, res: Response, next: NextFunction) {
    if (req.params.nombre) next();
    else {
        res.status(400).send({
            status: 'warn',
            msg: 'Se debe especificar el nombre del modificador'
        });
    } 
}
