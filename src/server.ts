import { connect } from 'mongoose';
import { app } from './app';

const PORT: number = 3000;

async function run () {
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
  
run();