import { Schema, model } from "mongoose";

const ordenSchema = new Schema({
    hora: {
        type: Date,
        default: Date.now,
        required: true
    },
    usuario: {
        //type: Schema.Types.ObjectId,
        //ref: 'USUARIO',
        type: String,
        required: true
    },
    estatus: {
        type: String,
        enum: ["PREPARANDO", "ENTREGADO", "CANCELADO"],
        default: 'PREPARANDO',
        required: true
    },
    metodoPago: {
        type: String,
        enum: ["TARGETA CREDITO", "CONTRA ENTREGA"],
        required: true
    },
    direccionEnvio: {
        type: String,
        maxLength: 50,
        required: true
    },
    menu: [{
        //type: Schema.Types.ObjectId,
        //ref: 'Menu',
        type: String,
        required: true
    }],
    modificadores: [{
        //type: Schema.Types.ObjectId,
        //ref: 'Modificador',
        type: String,
        required: true
    }],
    costo: {
        totalPlatillos: {
            type: Number,
            min: 0,
            required: true
        },
        totalModificadores: {
            type: Number,
            min: 0,
            required: true
        },
        propina: {
            type: Number,
            min: 0,
            required: true
        },
        subTotal: {
            type: Number,
            min: 0,
            required: true
        },
        total: {
            type: Number,
            min: 0,
            required: true
        },
    }
}, {versionKey: false});


export const Orden = model ("Ordene", ordenSchema);
