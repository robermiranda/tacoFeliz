# TACO FELIZ

Este es un repositorio público que corresponde a una prueba técnica cuyo status es *en desarrollo*. La prueba consiste unicamente de *backend* y hasta el momento las características implementadas son las siguientes:

- Crear, editar, listar y eliminar elementos del menú
- Crear, editar, listar y eliminar elementos modificadores
- Creación de usuarios
- Registro en aplicación
- Persistencia de datos en Mongodb Atlas
- Despliegue de aplicación en render.com

La *url* de la aplicación es: *https://taco-feliz.onrender.com* y desde el navegador puede consultar los siguientes recursos:

- [Lista de menú](https://taco-feliz.onrender.com/menu)
- [Lista de modificadores](https://taco-feliz.onrender.com/menu/modificadores)

### ARQUITECTURA

En los *requerimientos obligatorios* de este proyecto se pide desarrollar un *backend* hacinedo uso del motor de ejecución *Node js* y alguno de sus framewords. Para cumplir con el requirimiento se han usado las siguientes tecnologías:

- **Node js** como motor de ejecución.
- **Express js** para la construcción del API REST.
- **Typescript** para escribir código con menor incidencia de bugs.
- **Prisma** *orm/odm* para conectarse con la base de datos y simplificar las operaciones *CRUD*.
- **Mongodb Atlas** base de datos *NoSQL* en la nube basada en *javascript*.

Con estas tecnologías se ha desarrollado un *API REST* con una arquitectura de 3 capas:

**CLIENTE**  ----->  **SERVIDOR**  ----->  **BASE DE DATOS**

### EJEMPLOS

Para realizar operaciones *CRUD* en los recursos *menu* y *modificadores* se pueden seguir los siguientes ejemplos utilizando *curl*.

Registro de usuario:
```
curl -X POST localhost:3000/usuario -H 'Content-Type: application/json' \
-d '{"nombre": "Beatriz", "apPaterno": "Bravo"}' \
-d '{"email": "beatriz@gmail.com", "password": "abc123"}'
```

Agregar un modificador:
```
curl -X POST localhost:3000/menu/modificadores -H 'Content-Type: application/json' \
-d '{"nombre": "condimento extra", "disponibilidad": "true", "precio": 5.00}'
```

Más ejemplos los puede encontrar en el archivo *docs/curlRequest.txt* del repositorio.

### PERSISTENCIA DE DATOS

Se ha utilizado *prisma orm* como mecanismo de persistencia en *mongodb*. La creación de colecciones se hace directamente en *mongosh* con el comando: 

`db.createCollection(<name collection>, <options>)`

Se ha usado la propiedad *$jsonSchema* para dar forma a las colecciones creadas, es decir que con este mecanismo se especifica las propiedades obligatorias de cada documento insertado así como las restricciones necesarias en la lógica de negocio. Por ejemplo par especificar que la variable *precio* del modificador debe tomar valores numericos mayores o iguales que cero se realiza de la siguiente manera:

```
precio: {
	bsonType: "number",
	minimum: 0,
    description: "Precio del modificador"
}
```

De esta manera se da a la *base de datos* la responsabilidad de *insertar/modificar* un documento con los requerimientos del negocio. Para mayor detalle sobre los schemas de las colecciones vease el documento: *docs/schemas.txt*.

### BUILD

Para la construcción del proyecto de manera local hay que ralizar el siguiente procedimiento.

- Clonar el proyecto: *git clone git@github.com:robermiranda/tacoFeliz.git*
- Crear el archivo *.env* con la variable de ambiente secreta: *DATABASE_URL*
- Inicializar: *npm init*
- Build: *tsc*
- Run: *node dist/server.js*

El detalle para desplegar localmente la aplicación esta en la variable de ambiente:

`DATABASE_URL=mongodb+srv://<user>:<password>.qgye5kk.mongodb.net/taco-feliz`

El valor de esta variable es la cadena de conexión a la base de datos *taco-feliz* en mongodb atlas y hay que agregar los valores propios: *user*  y *password*.

También es necesario contar con registro en *mongodb atlas* para poder crear ahí la base de datos. Sin embargo puede probar la aplicación desplegada en *render.com*: *https://taco-feliz.onrender.com*

Se pueden seguir los ejemplos mencionados en el archivo *docs/curlRequest.txt* para realizar pruebas, claro esta que en vez de *curl* se puede usar *postman* u otra herramienta.


### QUE FALTA?

El status del proyecto es: *en desarrollo* y aún falta por implementar muchas características:

- pruebas unitarias (con *jest*)
- envio de emails al registrarse un usuario
- manejo de sesiones (con *jwt*)
- ordenes de menú
- encriptar contraseñas (no requerido)



