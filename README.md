# TACO FELIZ

Este es un repositorio público que corresponde a una prueba técnica cuyo status es *en desarrollo*. La prueba consiste unicamente de *backend* y hasta el momento las características implementadas son las siguientes:

- Crear, editar, listar y eliminar elementos del menú
- Crear, editar, listar y eliminar elementos modificadores
- Creación de usuarios
- Registro en aplicación
- Ver menú
- Verificar disponibilidad y totales
- Enviar orden al restaurante
- Cancelar pedido
- Persistencia de datos en Mongodb Atlas
- Despliegue de aplicación en render.com

La *url* de la aplicación es: *https://taco-feliz.onrender.com* y desde el navegador puede consultar los siguientes recursos:

- [Lista de usuarios](https://taco-feliz.onrender.com/usuario)
- [Lista de modificadores](https://taco-feliz.onrender.com/modificador)
- [Lista de menus](https://taco-feliz.onrender.com/menu)
- [Lista de ordenes](https://taco-feliz.onrender.com/orden)

### ARQUITECTURA

En los *requerimientos obligatorios* de este proyecto se pide desarrollar un *backend* hacinedo uso del motor de ejecución *Node js* y alguno de sus framewords. Para cumplir con el requerimiento se han usado las siguientes tecnologías:

- **Node js** como motor de ejecución.
- **Express js** para la construcción del API REST.
- **Typescript** para escribir código con menor incidencia de bugs.
- **Mongoose** *odm* para conectarse con la base de datos y simplificar las operaciones *CRUD*.
- **Mongodb Atlas** base de datos *NoSQL* en la nube basada en *javascript*.

Con estas tecnologías se ha desarrollado un *API REST* con una arquitectura de 3 capas:

**CLIENTE**  ------->  **SERVIDOR**  ------->  **BASE DE DATOS**

De la especificación de la prueba técnica se obtienen las siguientes *entidades*:

- Orden. Representa la orden de compra de un menú
- Menú. Son los platillos que ofrece el restaurante taco feliz
- Modificadores. Son ingredientes extra del menú y estos son opcionales
- Usuario. Representa un cliente del restaurante, alguien que va a comprar un menú
- Costo. La suma total de los precios de la propina, menús y modificadores adquiridos por el cliente

Las cuales se relacionan como se aprecia en el siguiente diagrama de clases

![Diagrama de clases](https://drive.google.com/uc?export=view&id=1rfFGLrfm1WWVYHCiKltlN93VT1sMw-AN)

El diseño de datos que se propone es una *arquitectura estrella* en donde tenemos una clase central: *Orden* y las demás clases se relacionan solo con esta clase. Esta es una arquitectura muy sencilla y fácil de modelar ya que no se tienen varios niveles de dependencia.

Hay que aclarar que la clase *Costo* es una clase que por si sola no tiene sentido; y por lo mismo no tiene un identificador *id*. Esta clase puede ser una clase interna a la clase *Orden* o bien puede representarse como un valor compuesto (un objeto javascript) de la propiedad *costo* en la clase *Orden*.

Varios atributos de las clases tienen valores de *enum*; por ejemplo la propiedad *categoria* de la clase *Menu* es un *enum* y sus valores son: *entrada*, *plato fuerte*, *postre* y  *bebida*. Así tenemos las siguientes *enums*:

- usuario.tipo: USUARIO_FINAL | SUPER_ADMIN
- usuario.estatus: ACTIVO | BLOQUEADO
- orden.estatus: CREADA | PREPARANDO | CANCELADO | ENTREGADA
- orden.metodoPago: CONTRA_ENTREGA | TARJEGA_CREDITO
- menu.categoria: ENTRADA | PLATO_FUERTE | POSTRE | BEBIDA

Respecto de las propiedades de *estatus* estos pueden cambiar con el tiempo; así por ejemplo el *estatus* para una entidad de la clase *Usuario* inicia con un valor: *ACTIVO* pero puede pasar a *BLOQUEADO*.

Analizando el *estatus* de la clase *Orden* resulta ser más interesante, pues una orden inicia en el estado *CREADA* y puede pasar a los estados *PREPARANDO* o *CANCELADA*. Del estado *PREPARANDO* se puede pasar a los estados finales *CANCELADA* o *ENTREGADA*.

![Maquina de Estados de una Orden](https://drive.google.com/uc?export=view&id=1B-T-NVhLUrt2L_-62hCBA48RPGfGGm9Z)


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
curl -X POST localhost:3000/modificador -H 'Content-Type: application/json' \
-d '{"nombre": "condimento extra", "disponibilidad": "true", "precio": 5.00}'
```

Más ejemplos los puede encontrar en el archivo *docs/curlRequest.txt* del repositorio.

### PERSISTENCIA DE DATOS

Se ha utilizado *Mongoose odm* como mecanismo de persistencia en *mongodb*. La creación de colecciones se hace directamente en *mongosh* con el comando: 

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

- envio de emails al registrarse un usuario
- manejo de sesiones (con *jwt*)
- Cambio automático des estatus de la orden de PREPARANDO a ENTREGADO después de 5 minutos
- encriptar contraseñas (no requerido)



