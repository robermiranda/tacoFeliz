"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modificador = void 0;
const mongoose_1 = require("mongoose");
const modificadorSchema = new mongoose_1.Schema({
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
    }
}, { versionKey: false });
exports.Modificador = (0, mongoose_1.model)("Modificadore", modificadorSchema);
