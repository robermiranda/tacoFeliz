import { ESTATUS_USUARIO, usuarioI, Usuario as UsuarioModel } from "../models/Usuario";

export class Usuario {
    
    usuario: usuarioI;

    constructor (usuario: usuarioI) {
        this.usuario = usuario;
    }

    static async getUsuarios (): Promise<usuarioI[]> {
        try {
            const usuarios = await UsuarioModel.find({});
            return usuarios;
        }
        catch (err) { throw err; }
    }

    public async create() {
        try {
            const resUsuario = await UsuarioModel.create(this.usuario);
            return resUsuario._id;
        }
        catch (err) { throw err; }
    }

    public async bloquear () {
        try {
            const res = await UsuarioModel.updateOne(
                {email: this.usuario.email},
                {estatus: ESTATUS_USUARIO.bloqueado}
            );

            return res.modifiedCount;
        }
        catch (err) { throw err; }
    }
}

