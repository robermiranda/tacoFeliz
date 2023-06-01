import express, { Application, NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import menuRouter from './routes/menu';
import ordenRouter from './routes/orden';

const app: Application = express();
const PORT: number = 3000;

app.use(logger('dev'));

app.use('/menu', menuRouter);
app.use('/orden', ordenRouter);

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