import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const router = express.Router();
const prisma = new PrismaClient();
const {categoria, modificadores, menu} = require('../datos/menu');

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
        console.error('ERROR al obtener todos los usuarios', err);
        res.status(500).send({
            status: 'error',
            msg: 'ERROR al obtener lista de modificadores'
        });
    }
})
.get('/detalle', function (req: Request, res: Response) {
    // caso de uso (usuario final): ver menú
    // para este caso hay que proporcionar el nombre del menu para obtener el detalle
    // el detalle solo de ese menu.
    const menuResponse = menu.map((_menu: any) => {
        const categoriaDesc = categoria[_menu.categoria];
        
        const modificadoresDesc = _menu.modificadores.map((modificadorId: string) => {
            return modificadores.find((modificador: any) => modificador.id === modificadorId);
        });

        return {
            ..._menu,
            categoria: categoriaDesc,
            modificadores: modificadoresDesc
        }

    });

    res.send({
        status: 'ok',
        data: menuResponse
    });
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
        console.error('ERROR al insertar modificador', menu.nombre, err);
        res.status(500).send({
            status: 'error',
            msg: 'modificador NO registrado'
        });
    }


})
.patch('/', validaMenuParaEditar, function (req: Request, res: Response) {
    // caso de uso (usuario admin): editar un menú
    const {menuId, categoria, nombre, notas, precio, disponibilidad, modificadores, imagen} = req.body;

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
        console.error('ERROR al obtener todos los usuarios', err);
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
        console.error('ERROR al insertar modificador', modificador.nombre, err);
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
        console.error(msg, err);
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
/*
function validaModificador (req: Request, res: Response, next: NextFunction) {
    const {nombre, precio, disponibilidad} = req.body;
    const _precio = Number.parseFloat(precio);

    if (disponibilidad && 
        nombre &&
        nombre.length <= NOMBRE_LONG_MAX &&
        _precio &&
        ! Number.isNaN(_precio) &&
        _precio >= PRECIO_MIN) {
        
        next();
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: `Son obligatorios los datos: nombre.length <= ${NOMBRE_LONG_MAX}, precio > ${PRECIO_MIN} y disponibilidad`
        });
    }
}*/

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
    const _precio = Number.parseFloat(precio);

    const aux = CATEGORIAS.findIndex(categoria => categoria === categoria.toUpperCase());

    console.log('CATEGORIA INDEX', aux, aux > -1, categoria.toUpperCase(), CATEGORIAS[0]);
    if (nombre && nombre.length <= NOMBRE_LONG_MAX &&
        CATEGORIAS.findIndex(cat => cat.toUpperCase() === categoria.toUpperCase()) > -1 &&
        ! Number.isNaN(_precio) && _precio >= PRECIO_MIN &&
        disponibilidad &&
        ( ! notas || (notas && notas.length <= NOTAS_LONG_MAX)) &&
        ( ! modificadores || (Array.isArray(modificadores) && modificadores.length > 0)) &&
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


function validaModificadorParaEditar (req: Request, res: Response, next: NextFunction) {
    const {nombre, precio, disponibilidad} = req.body;
    const _precio = Number.parseFloat(precio);

    if (nombre && (disponibilidad ||
        ( ! Number.isNaN(_precio) && _precio >= 0))) {
    
        next();
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: `Datos obligatorios: nombre y (precio >= 0 o disponibilidad)`
        });
    }
}

function validaMenuParaEditar (req: Request, res: Response, next: NextFunction) {
    const {menuId, categoria, nombre, notas, precio, disponibilidad, modificadores} = req.body;
    const _precio = Number.parseFloat(precio);

    if ((categoria || disponibilidad || nombre || _precio || notas || modificadores) && 
        menuId &&
        ( ! precio || (! Number.isNaN(_precio) && _precio >= PRECIO_MIN)) &&
        ( ! notas || notas.length <= NOTAS_LONG_MAX) &&
        ( ! modificadores || (Array.isArray(modificadores) && modificadores.length > 0))) {

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

function validaModificadorNombre (req: Request, res: Response, next: NextFunction) {
    if (req.params.nombre) next();
    else {
        res.status(400).send({
            status: 'warn',
            msg: 'Se debe especificar el nombre del modificador'
        });
    } 
}

function validaMenuId (req: Request, res: Response, next: NextFunction) {
    
    if ( ! req.params.menuId) {
        res.status(400).send({
            status: 'warn',
            msg: 'Se debe especificar el id del menu'
        });
    }
    else {
        const index: number = menu.findIndex((_menu: modificadorT) => {
            return (_menu.id === req.params.menuId);
        });

        if (index > -1) next();
        else {
            res.status(400).send({
                status: 'warn',
                msg: 'Menú NO encontrado'
            });    
        }
    } 
}

const getBooleanVal = (val: string) => (val === 'true');