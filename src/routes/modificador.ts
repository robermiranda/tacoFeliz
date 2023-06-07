import express, { NextFunction, Request, Response } from 'express';
import { Modificador } from '../models/Modificador';
import { stdRes } from '../util';

const router = express.Router();

export default router.get('/', async function (req: Request, res: Response) {
    // usuario Admin
    // devuelve lista de modificadores

    try {
        const modificadores = await Modificador.find({});
        res.send(stdRes('ok', `modificadores obtenidos: ${modificadores.length}`, modificadores));
    }
    catch (err) {
        res.status(500).send(stdRes('error','ERROR al obtener modificadores'));
        throw err;
    }
})
.post('/', async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: dar alta a un modificador

    const modificador: modificadorT = {
        nombre: req.body.nombre,
        precio: req.body.precio
    }

    try {
        const _modificador = await Modificador.create(modificador);
        res.send(stdRes('ok', `modificador creado con id: ${_modificador._id}`));
    }
    catch (err) {
        res.status(500).send(stdRes('error', 'modificador NO registrado'));
        throw err;
    }
})
.delete('/:nombre', validaModificadorNombre, async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: eliminar un modificador

    try {
        const response = await Modificador.deleteOne({nombre: req.params.nombre});
        if (response.deletedCount === 1) res.send(stdRes('ok'));
        else res.send(stdRes('warn', 'modificador NO eliminado'));
    }
    catch (err) {
        res.status(500).send(stdRes('error', 'modificador NO eliminado'));
        throw err;
    }
})
.patch('/', validaModificadorParaEditar, async function (req: Request, res: Response) {
    // usuario admin
    // caso de uso: editar un modificador
    // por simplicidad se ha dado la capacidad de editar unicamente
    // el precio y la disponibilidad, dejando al nombre como identificador
    // del modificador

    const { nombre, disponibilidad, precio } = req.body;
    const modificador: any = {}

    if (disponibilidad) modificador.disponibilidad = getBooleanVal(disponibilidad);
    if (precio) modificador.precio = Number.parseFloat(precio);

    try {
        const response = await Modificador.updateOne({nombre}, modificador);

        if (response.modifiedCount === 1) res.send(stdRes('ok'));
        else res.status(400).send(stdRes('warn', 'modificador NO actualizado'));
    }
    catch (err) {
        res.status(500).send(stdRes('error', 'modificador NO actualizado'))
    }
});

// Declaración de tipos  ******************************************************

type modificadorT = {
    nombre: string,
    precio: number,
    disponibilidad?: boolean
}

// Funciones Auxiliares  ******************************************************

const getBooleanVal = (val: string) => (val === 'true');
const PRECIO_MIN: number = 0;

function validaModificadorParaEditar (req: Request, res: Response, next: NextFunction) {
    const {nombre, precio, disponibilidad} = req.body;
    const _precio = Number.parseFloat(precio);

    if (nombre && (disponibilidad ||
        ( ! Number.isNaN(_precio) && _precio >= PRECIO_MIN))) {
    
        next();
    }
    else {
        res.status(400).send(stdRes('warn', `Datos obligatorios: nombre y (precio >= 0 o disponibilidad)`));
    }
}

function validaModificadorNombre (req: Request, res: Response, next: NextFunction) {
    if (req.params.nombre) next();
    else {
        res.status(400).send(stdRes('warn', 'Se debe especificar el nombre del modificador'));
    } 
}
