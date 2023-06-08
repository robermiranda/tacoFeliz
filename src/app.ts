import express, { Application, NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import rutaMenu from './routes/menu';
import rutaModificador from './routes/modificador'
import rutaOrden from './routes/orden';
import rutaUsuario from './routes/usuario';
import rutaSesion from './routes/sesion';
import 'dotenv/config';

export const app: Application = express()
.use(bodyParser.json())
.use(logger('dev'))
.use('/menu', rutaMenu)
.use('/modificador', rutaModificador)
.use('/orden', rutaOrden)
.use('/usuario', rutaUsuario)
.use('/sesion', rutaSesion)
.use(function (req: Request, res: Response) {
    res.send({status: 'warn', msg: '404. Recurso no encontrado.'});    
})
.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error('ERROR 500.', err.message);
    console.error('ERROR DETALLE.', err);
    res.status(500);
    res.send({status: 'error', msg: 'ERROR en el servidor.'});
});
