"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = exports.stdRes = void 0;
function stdRes(status, msg, data) {
    const datos = { status };
    if (msg)
        datos.msg = msg;
    if (data)
        datos.data = data;
    const response = datos;
    return response;
}
exports.stdRes = stdRes;
function throwError(err, res, _msg) {
    let msg = _msg ? _msg : 'ERROR';
    if (err.message)
        msg = err.message;
    else if (err.meta && err.meta.cause)
        msg = err.meta.cause;
    res.status(500).send(stdRes('error', msg));
}
exports.throwError = throwError;
