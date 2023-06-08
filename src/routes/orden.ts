import express, { NextFunction, Request, Response } from 'express';
import { Orden } from '../models/Orden';
import { Menu } from '../models/Menu';
import { Modificador } from '../models/Modificador';
import { stdRes, throwError } from '../util';


const router = express.Router();

export default router.get('/', async function (req: Request, res: Response) {
    // usuario Adimin
    // Obtiene la lista de menu

    try {
        const menu = await Orden.find({});
        res.send(stdRes('ok', `menus obtenidos: ${menu.length}`, menu));
    }
    catch (err: any) { throwError(err, res) }
})
.get('/:id', async function (req: Request, res: Response) {
    // usuarios: admin y final
    // caso de uso: Verificar diponibilidad y totales
    
    try {
        const menu = await Orden.findOne({_id: req.params.id}).exec();

        if (menu) res.send(stdRes('ok', undefined, menu));
        else res.send(stdRes('warn', 'Sin resultados'));
    }
    catch (err: any) { throwError(err, res) }
})
.post('/', preValidaOrden, async function (req: Request, res: Response) {
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
console.log('MENUS.', typeof menus, Array.isArray(menus), menus);

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
.patch('estatus', async function (req: Request, res: Response) {
    // usuarios final y admin
    // caso de uso: cancelar una orden si su estado es PREPARANDO

    const cancelado: ordenEstatusT = 'CANCELADO';
    const preparando: ordenEstatusT = 'PREPARANDO';
    try {
        const response = await Orden.updateOne(
            {
                email: req.body.emailUsuario,
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

function validaObjectId (menus: any) {
    if ( ! Array.isArray(menus)) return false;

    if (menus.length > 20) return false;

    // An Schema.Types.ObjectId must have a length = 24
    return menus.every(x => x.length === 24);
}

function preValidaOrden (req: Request, res: Response, next: NextFunction) {
    
    const { usuario, direccionEnvio, metodoPago, menu, modificadores, propina } = req.body;

    if (usuario &&
        direccionEnvio && direccionEnvio.length <= 50 &&
        validaMetodoPago(metodoPago) &&
        validaObjectId(menu) &&
        ( ! modificadores || validaObjectId(modificadores)) &&
        ( ! propina || validaPropina(propina))) {

        next();
    }
    else {
        res.status(400)
        .send(stdRes('warn', 'Los datos de entrada NO son validos'));
    }
}
