import express, { Application, NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import rutaMenu from './routes/menu';
import rutaOrden from './routes/orden';
import rutaUsuario from './routes/usuario';
import rutaSesion from './routes/sesion';
import 'dotenv/config';

const app: Application = express();
const PORT: number = 3000;

app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/menu', rutaMenu);
app.use('/orden', rutaOrden);
app.use('/usuario', rutaUsuario);
app.use('/sesion', rutaSesion);

app.use(function (req: Request, res: Response) {
    res.send({status: 'warn', msg: '404. Recurso no encontrado.'});    
});

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error('ERROR 500.', err.message);
    console.error('ERROR DETALLE.', err);
    res.status(500);
    res.send({status: 'error', msg: 'ERROR en el servidor.'});
});

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});