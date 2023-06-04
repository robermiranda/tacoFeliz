import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const router = express.Router();
const prisma = new PrismaClient();
const {categoria, modificadores, menu} = require('../datos/menu');

const NOTAS_LONG_MAX: number = 80;
const NOMBRE_LONG_MAX: number = 40;
const PRECIO_MIN: number = 0;

export default router.get('/', function (req: Request, res: Response) {
    // devuleve la lista de menú
    // esta acción solo la puede ejecutar el usuario admin
    res.send({
        status: 'ok',
        data: menu
    })
})
.get('/', function (req: Request, res: Response) {
    // devuleve la lista de modificadores
    // esta acción solo la puede ejecutar el usuario admin
    res.send({
        status: 'ok',
        data: menu
    })
})
.get('/detalle', function (req: Request, res: Response) {
    // caso de uso (usuario final): ver menú
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
.post('/', validaMenu, function (req: Request, res: Response) {
    // caso de uso (usuario admin): dar de alta un modificador
    const {categoria, nombre, notas, precio, disponibilidad, modificadores, imagen} = req.body;

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
.delete('/:menuId', validaMenuId, function (req: Request, res: Response) {
    // caso de uso (usuario admin): eliminar un menú

    // se procede a enviar la peticion a la db

    res.send({
        status: 'ok',
        msg: 'menú eliminado',
        data: req.params.menuId
    });
})
.get('/modificadores', async function (req: Request, res: Response) {
    // devuleve la lista de modificadores
    // esta acción solo la puede ejecutar el usuario admin

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
.delete('/modificadores/:modificadorId', validaModificadorId, function (req: Request, res: Response) {
    // caso de uso (usuario admin): eliminar un modificador

    // se procede a enviar la peticion a la db

    res.send({
        status: 'ok',
        msg: 'modificador eliminado',
        data: req.params.modificadorId
    });
})
.patch('/modificadores', validaModificadorParaEditar, function (req: Request, res: Response) {
    // caso de uso (usuario admin): editar un modificador

    const modificadorId = req.body.modificadorId;
    const nombre: string = req.body.nombre;
    const precio: number = Number.parseFloat(req.body.precio);
    const disponibilidad: boolean = req.body.disponibilidad;

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

// Declaración de tipos  ******************************************************

type modificadorT = {
    id?: string,
    nombre: string,
    precio: number,
    disponibilidad: boolean
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

function validaMenu (req: Request, res: Response, next: NextFunction) {
    const {categoria, nombre, notas, precio, disponibilidad, modificadores} = req.body;
    const _precio = Number.parseFloat(precio);

    if (categoria &&
        disponibilidad && 
        nombre &&
        nombre.length <= NOMBRE_LONG_MAX &&
        _precio &&
        ! Number.isNaN(_precio) &&
        _precio >= PRECIO_MIN &&
        ( ! notas || (notas && notas.length <= NOTAS_LONG_MAX)) &&
        (! modificadores || (Array.isArray(modificadores) && modificadores.length > 0))) {
        
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
    const {modificadorId, nombre, precio, disponibilidad} = req.body;
    const _precio = Number.parseFloat(precio);

    if ((nombre || _precio || disponibilidad) &&
        modificadorId &&
        ( ! nombre || nombre.length <= NOMBRE_LONG_MAX) &&
        ( ! precio || ( ! Number.isNaN(_precio) && _precio >= PRECIO_MIN))) {

        next();
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: `El modificadorId es obligatorio y almenos uno de los siguientes datos son obligatorios: nombre.length <= ${NOMBRE_LONG_MAX}, precio > ${PRECIO_MIN} y disponibilidad`
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

function validaModificadorId (req: Request, res: Response, next: NextFunction) {
    
    if ( ! req.params.modificadorId) {
        res.status(400).send({
            status: 'warn',
            msg: 'Se debe especificar el id del modificador'
        });
    }
    else {
        const index: number = modificadores.findIndex((modificador: modificadorT) => {
            return (modificador.id === req.params.modificadorId);
        });
        if (index > -1) next();
        else {
            res.status(400).send({
                status: 'warn',
                msg: 'Modificador NO encontrado'
            });    
        }
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