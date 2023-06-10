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

export function throwError (err: any, res: Response, _msg?: msgT)  {
    
    let msg = _msg ? _msg : 'ERROR';
    if (err.message) msg = err.message;
    else if (err.meta && err.meta.cause) msg = err.meta.cause;

    res.status(500).send(stdRes('error', msg));
}
