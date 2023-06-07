"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const mongoose_1 = require("mongoose");
const menuSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        maxLength: 40,
        required: true,
        index: true,
        unique: true
    },
    precio: {
        type: Number,
        min: 0
    },
    disponibilidad: {
        type: Boolean,
        default: true
    },
    notas: {
        type: String,
        maxLength: 80
    },
    categoria: {
        type: String,
        enum: ["ENTRADA", "PLATO FUERTE", "POSTRE", "BEBIDA"]
    },
    modificadores: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Modificador' }],
    imagen: String
}, { versionKey: false });
exports.Menu = (0, mongoose_1.model)("Menu", menuSchema);
