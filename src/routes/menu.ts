import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();
const {categoria, modificadores, menu} = require('../datos/menu');


function validaModificador (req: Request, res: Response, next: NextFunction) {
    const {nombre, precio, disponibilidad} = req.body;
    const _precio = Number.parseFloat(precio);

    if (disponibilidad && 
        nombre &&
        nombre.length <= 40 &&
        _precio &&
        ! Number.isNaN(_precio) &&
        _precio >= 0) {
        
        next();
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: 'Son obligatorios los datos: nombre.length <= 40, precio > 0 y disponibilidad'
        });
    }
}

function validaModificadorParaEditar (req: Request, res: Response, next: NextFunction) {
    const {modificadorId, nombre, precio, disponibilidad} = req.body;
    const _precio = Number.parseFloat(precio);

    if (modificadorId && (disponibilidad || 
        (nombre && nombre.length <= 40) ||
        _precio && ! Number.isNaN(_precio) && _precio >= 0)) {
        
        next();
    }
    else {
        res.status(400).send({
            status: 'warn',
            msg: 'El modificadorId es obligatorio y almenos uno de los siguientes datos son obligatorios: nombre.length <= 40, precio > 0 y disponibilidad'
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

export default router.get('/', function (req: Request, res: Response) {
    // devuleve la lista de menú
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
.get('/modificadores', function (req: Request, res: Response) {
    // devuleve la lista de modificadores
    // esta acción solo la puede ejecutar el usuario admin
    res.send({
        status: 'ok',
        data: modificadores
    })
})
.post('/modificadores', validaModificador, function (req: Request, res: Response) {
    // caso de uso (usuario admin): dar de alta un modificador
    const nombre: string = req.body.nombre;
    const precio: number = Number.parseFloat(req.body.precio);
    const disponibilidad: boolean = req.body.disponibilidad;

    // se procede a enviar a la db el nuevo modificador

    res.send({
        status: 'ok',
        msg: 'modificador agregado',
        data: {
            nombre, precio, disponibilidad
        }
    });
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

type modificadorT = {
    id: string,
    nombre: string,
    precio: number,
    disponibilidad: boolean
}