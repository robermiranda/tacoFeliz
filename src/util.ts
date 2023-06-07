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