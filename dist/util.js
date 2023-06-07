"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stdRes = void 0;
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
