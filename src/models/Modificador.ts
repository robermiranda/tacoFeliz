import { Schema, model } from "mongoose";

const modificadorSchema = new Schema({
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
}, {versionKey: false});

export const Modificador = model ("Modificadore", modificadorSchema);
