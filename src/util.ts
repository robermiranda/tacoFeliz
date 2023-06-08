import { Response } from "express";

type statusT = "ok" | "warn" | "error" | undefined;
type msgT = string | undefined;
type resT = {
    status: statusT,
    msg: msgT,
    data: any
}

export function stdRes (status: statusT, msg?: msgT, data?: any) {
    
    const datos: any = {status}
    
    if (msg) datos.msg = msg;
    if (data) datos.data = data;
    
    const response: resT = datos;

    return response;
}

export function throwError (err: any, res: Response)  {
    
    let msg = 'ERROR';
    if (err.meta && err.meta.cause) msg = err.meta.cause;
    else if (err.errInfo && err.errInfo.details) msg = JSON.stringify(err.errInfo.details);

    res.status(500).send(stdRes('error', msg));
    throw err;
}
