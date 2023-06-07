import { Schema, model } from "mongoose";

const menuSchema = new Schema({
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
    modificadores: [{type: Schema.Types.ObjectId, ref: 'Modificador'}],
    imagen: String
}, {versionKey: false});


export const Menu = model ("Menu", menuSchema);
