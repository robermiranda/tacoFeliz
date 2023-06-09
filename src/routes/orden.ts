import express, { NextFunction, Request, Response } from 'express';
import { Orden } from '../models/Orden';
import { Menu } from '../models/Menu';
import { Modificador } from '../models/Modificador';
import { Usuario } from '../models/Usuario';
import { stdRes, throwError } from '../util';


export default express.Router()
.get('/', async function (req: Request, res: Response) {
    // usuario Adimin
    // Obtiene la lista de menu

    try {
        const menu = await Orden.find({});
        res.send(stdRes('ok', `menus obtenidos: ${menu.length}`, menu));
    }
    catch (err: any) { throwError(err, res) }
})
.get('/:id', validaOrdenId, async function (req: Request, res: Response) {
    // usuarios: admin y final
    // caso de uso: Verificar diponibilidad y totales
    
    try {
        const menu = await Orden.findOne({_id: req.params.id}).exec();

        if (menu) res.send(stdRes('ok', undefined, menu));
        else res.send(stdRes('warn', 'SIN RESULTADOS'));
    }
    catch (err: any) { throwError(err, res) }
})
.post('/', preValidaOrden,
    validaMenuModificadoresIds,
    async function (req: Request, res: Response) {
    // usuario final
    // caso de usu: Enviar orden al restaurante

    const { usuario, direccionEnvio, metodoPago, menu: menus, modificadores, propina } = req.body;

    let _propina = 0;
    if (propina) _propina = Number.parseFloat(propina);

    // Se obtienen los menus y los modificadores de la orden
    try {
        let totalPlatillos: number = 0;
        let totalModificadores: number = 0;
        
        for (const menu of await Menu.find().where('_id').in(menus).exec()) {
            if (menu.precio) totalPlatillos += menu.precio;
        }
        for (const modificador of await Modificador.find().where('_id').in(modificadores).exec()) {
            if (modificador.precio) totalModificadores += modificador.precio;
        }

        // Se calculan subtotal y total
        const subTotal: number = totalPlatillos + totalModificadores;
        const total: number = (1 + _propina) * subTotal;
        const costo: costoT = {
            totalPlatillos,
            totalModificadores,
            propina: _propina,
            subTotal,
            total
        }

        const orden: ordenT = {
            usuario,
            direccionEnvio,
            metodoPago,
            menu: menus,
            modificadores,
            costo
        }

        const response = await Orden.create(orden);
        res.send(stdRes('ok', undefined, {id: response._id}));
    }
    catch (err: any) { throwError(err, res) }
})
.patch('/estatus', async function (req: Request, res: Response) {
    // usuarios final y admin
    // caso de uso: Cancelar una orden si su estado es PREPARANDO

    const cancelado: ordenEstatusT = 'CANCELADO';
    const preparando: ordenEstatusT = 'PREPARANDO';

    try {
        const response = await Orden.updateOne(
            {
                _id: req.body.id,
                estatus: preparando
            },
            {estatus: cancelado}
        );

        let stdres;
        if (response.modifiedCount === 1) stdres = stdRes('ok');
        else stdres = stdRes('warn', 'orden NO cancelada');

        res.send(stdres);
    }
    catch (err: any) { throwError(err, res) }
});

// Declaración de tipos  ******************************************************

type ordenEstatusT = "PREPARANDO" | "ENTREGADO" | "CANCELADO";

type metodoPagoT = "TARJETA CREDITO" | "CONTRA ENTREGA";

type costoT = {
    totalPlatillos:     number,
    totalModificadores: number,
    propina:            number,
    subTotal:           number,
    total:              number
}

type ordenT = {
    hora?:          any,
    estatus?:       ordenEstatusT,
    usuario:        string,
    direccionEnvio: string,
    metodoPago:     metodoPagoT,
    menu:           string[],
    modificadores:  string[],
    costo:          costoT
}

// Funciones Auxiliares  ******************************************************

function validaPropina (_propina: any) {
    
    const propina = Number.parseFloat(_propina);
    
    if (Number.isNaN(propina)) return false;

    const index: number = [0, 5, 10, 15].findIndex((x: number) => x === propina);

    return (index >= 0);
}

function validaMetodoPago (metodoPago: any) {
    
    if ( ! metodoPago) return false;

    const index: number = ["TARJETA CREDITO", "CONTRA ENTREGA"].findIndex(x => x === metodoPago);

    return (index >= 0);
}

async function preValidaOrden (req: Request, res: Response, next: NextFunction) {
    
    const { usuario, direccionEnvio, metodoPago, menu, propina } = req.body;

    if ( ! await validaUsuarioId(usuario)) {
        res.status(400)
        .send(stdRes('warn', 'USUARIO ID NO VALIDO'));
    }
    else if (direccionEnvio && direccionEnvio.length <= 50 &&
        validaMetodoPago(metodoPago) &&
        menu &&
        ( ! propina || validaPropina(propina))) {

        next();
    }
    else {
        res.status(400)
        .send(stdRes('warn', 'DATOS DE ENTRADA NO VALIDOS'));
    }
}

function validaOrdenId (req: Request, res: Response, next: NextFunction) {
    if (req.params.id.length === 24) next();
    else {
        res.status(400)
        .send(stdRes('warn', 'ID NO VALIDO'));
    }
}

async function validaIds (ids: string[], Model: any): Promise<boolean> {
    let notIncluded = false;

    if ( ! Array.isArray(ids)) return false;
    
    const docs = await Model.find({}).exec();
    const modelIds: string[] = docs.map((doc: any) => doc._id.toString());

    if ( ! modelIds) return false;

    for (const id of ids) {
        if ( ! modelIds.includes(id))  {
            notIncluded = true;
            break;
        };
    }

    if (notIncluded) return false;
    
    return true;
}

async function validaUsuarioId (usuarioId: string): Promise<boolean> {
    const usuario = await Usuario.findById(usuarioId).exec();
    return usuario ? true: false;
}

async function validaMenuModificadoresIds (req: Request, res: Response, next: NextFunction) {
    
    const validaMenuIds = await validaIds(req.body.menu, Menu);

    if ( ! validaMenuIds) {
        res.status(400)
        .send(stdRes('warn', 'MENU ID NO VALIDO'));
    }
    else {
        const modificadores = req.body.modificadores;

        // Los modificadores son opcionales
        // por lo que puede NO haber modificadores
        if ( ! modificadores) next ();
        else {
            // Si hay modificadores entonces
            // se procede a validarlos
            const validaModificadorIds = await validaIds(req.body.modificadores, Modificador);

            if ( ! validaModificadorIds) {
                res.status(400)
                .send(stdRes('warn', 'MODIFICADOR ID NO VALIDO'));
            }
            else {
                next();            
            }
        }
    }
}