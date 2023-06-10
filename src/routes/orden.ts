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
        const menu = await Orden.findById(req.params.id).exec();

        if (menu) res.send(stdRes('ok', undefined, menu));
        else res.send(stdRes('warn', 'SIN RESULTADOS'));
    }
    catch (err: any) { throwError(err, res) }
})
.post('/totales', async function (req: Request, res: Response) {
    // usuario fianl
    // caso uso: verificar disponibilidad y totales
    // devuleve el total de la orden desglozada

    const { menu: menus, modificadores, propina: _propina } = req.body;

    try {
        let propina = getPropina(_propina);
        const menuDocs = await Menu.find().where('_id').in(menus).exec();
        const modificadoresDocs = await Modificador.find().where('_id').in(modificadores).exec();
        
        const totales: costoT = getTotales (menuDocs, modificadoresDocs, propina);
        
        const menusNoDisponibles = menuDocs
            .filter((menu: any) => ! menu.disponibilidad)
            .map((menu: any) => {
                return {
                    id: menu._id,
                    nombre: menu.nombre
                }
            });

        const modificadoresNoDisponibles = modificadoresDocs
            .filter((modificador: any) => ! modificador.disponibilidad)
            .map((modificador: any) => {
                return {
                    id: modificador._id,
                    nombre: modificador.nombre
                }
            });
        
        res.send(stdRes('ok', undefined, {
            totales,
            menusNoDisponibles,
            modificadoresNoDisponibles
        }));
        
    }
    catch (err: any) { throwError(err, res, 'ERROR AL OBTENER TOTALES') }
})
.post('/', preValidaOrden, async function (req: Request, res: Response) {
    // usuario final
    // caso de usu: Enviar orden al restaurante

    const { usuario, direccionEnvio, metodoPago, menu: menus, modificadores, propina: _propina } = req.body;

    try {
        let propina = getPropina(_propina);
        const menuDocs = await Menu.find().where('_id').in(menus).exec();
        const modificadoresDocs = await Modificador.find().where('_id').in(modificadores).exec();
        
        const totales: costoT = getTotales (menuDocs, modificadoresDocs, propina);

        const orden: ordenT = {
            usuario,
            direccionEnvio,
            metodoPago,
            menu: menuDocs.map((menu: any) => menu._id),
            modificadores: modificadoresDocs.map((modificador: any) => modificador._id),
            costo: totales
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

function getPropina (_propina: any): number {
    
    let propina = 0;
    
    if (_propina) {
        const pparsed = Number.parseFloat(_propina);
        if ( ! Number.isNaN(pparsed) && [0, 0.5, 0.1, 0.15].includes(pparsed)) propina = pparsed;
    }

    return propina;
}

function validaMetodoPago (metodoPago: any) {
    
    if ( ! metodoPago) return false;

    const index: number = ["TARJETA CREDITO", "CONTRA ENTREGA"].findIndex(x => x === metodoPago);

    return (index >= 0);
}

async function preValidaOrden (req: Request, res: Response, next: NextFunction) {
    
    const { usuario, direccionEnvio, metodoPago } = req.body;

    if ( ! await validaUsuarioId(usuario)) {
        res.status(400)
        .send(stdRes('warn', 'USUARIO ID NO VALIDO'));
    }
    else if (direccionEnvio &&
        direccionEnvio.length <= 50 &&
        validaMetodoPago(metodoPago)) {

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


async function validaUsuarioId (usuarioId: string): Promise<boolean> {
    const usuario = await Usuario.findById(usuarioId).exec();
    return usuario ? true: false;
}

function getTotales (menus: any[], modificadores: any[], propina: number): costoT {
    
    let totalPlatillos: number = 0;
    let totalModificadores: number = 0;
    
    for (const menu of menus) {
        if (menu.disponibilidad && menu.precio) totalPlatillos += menu.precio;
    }
    
    for (const modificador of modificadores) {
        if (modificador.disponibilidad && modificador.precio) {
            totalModificadores += modificador.precio;
        }
    }

    // Se calculan subtotal y total
    const subTotal: number = totalPlatillos + totalModificadores;
    const totalStr: string = Number.parseFloat(`${(1 + propina) * subTotal}`).toFixed(2);
    
    return {
        totalPlatillos,
        totalModificadores,
        propina,
        subTotal,
        total: Number.parseFloat(totalStr)
    }
}