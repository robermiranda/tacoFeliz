import express, { Application, NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import rutaMenu from './routes/menu';
import rutaModificador from './routes/modificador'
import rutaOrden from './routes/orden';
import rutaUsuario from './routes/usuario';
import rutaSesion from './routes/sesion';
import { connect } from 'mongoose';
import 'dotenv/config';

const app: Application = express();
const PORT: number = 3000;

app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/menu', rutaMenu);
app.use('/modificador', rutaModificador);
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

const start = async () => {
    try {
        if (process.env.DATABASE_URL) {
            console.log('Conectando con base de datos . . . . .');
            await connect(process.env.DATABASE_URL);
            console.log('base de datos conectada');
        
            app.listen(PORT, (): void => {
                console.log('SERVER IS UP ON PORT:', PORT);
            });
        }
        else {
            console.error('cadena de conexión a base de datos es vacia');
            process.exit(1);
        } 
    }
    catch (error) {
        console.error('SERVER DOWN.', error);
        process.exit(1);
    }
};
  
start();