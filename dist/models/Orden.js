"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orden = void 0;
const mongoose_1 = require("mongoose");
const ordenSchema = new mongoose_1.Schema({
    hora: {
        type: Date,
        default: Date.now,
        required: true
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'USUARIO',
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
        enum: ["TARJETA CREDITO", "CONTRA ENTREGA"],
        required: true
    },
    direccionEnvio: {
        type: String,
        maxLength: 50,
        required: true
    },
    menu: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Menu',
            required: true
        }],
    modificadores: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Modificador',
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
}, { versionKey: false });
exports.Orden = (0, mongoose_1.model)("Ordene", ordenSchema);
