import express, { Request, Response } from 'express';
import { usuarios, tipoUsuario, estatusUsuario } from '../datos/usuario';

const router = express.Router();

router.get('/', function (req: Request, res: Response) {
    
    const usuarioResponse: usuarioT[] = usuarios.map((usuario: usuarioT) => {

        const tipo: string | undefined = tipoUsuario.get(usuario.tipo);
        const estatus: string | undefined = estatusUsuario.get(usuario.estatus);

        if (tipo && estatus) return {
            ...usuario,
            tipo,
            estatus,
        }

        return usuario;
    });
    
    res.send(usuarioResponse);
});


export default router;

export type usuarioT = {
    id: string,
    tipo: string,
    estatus: string,
    nombre: string,
    apPaterno: string,
    apMaterno: string,
    email: string,
    password: string,
    direccion?: string
}

export type tipoUsuarioT = string;