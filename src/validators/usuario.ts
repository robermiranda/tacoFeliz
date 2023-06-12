// Middleware para validar datos de entrada para la ruta /usuario


import { Request, Response, NextFunction } from "express";

export function validaUsuario (req: Request, res: Response, next: NextFunction) {
    
    const LENGTH = 40;
    const { nombre, apPaterno, email, password } = req.body;

    if (nombre && nombre.length <= LENGTH &&
        ( ! apPaterno || apPaterno.length <= LENGTH) &&
        email && email.length <= LENGTH &&
        password && password.length <= LENGTH) {
    
        next();
    }
    else res.status(400).send({
        status: 'warn',
        msg: 'Los siguientes datos son obligatorios: nombre, correo electronico y contraseña'
    });
}
