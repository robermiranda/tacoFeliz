// With this index the field nombre must be unique
db.modificadores.createIndex({ "nombre": 1 }, { unique: true })

db.menu.createIndex({ "nombre": 1 }, { unique: true })


db.createCollection("modificadores", {
	validator: {
		$jsonSchema: {	
			bsonType: "object",
			required: ["nombre", "disponibilidad", "precio"],
			properties: {
				nombre: {
					bsonType: "string",
					maxLength: 40,
			        description: "Nombre del modificador"		
				},
				disponibilidad: {
					bsonType: "bool",
			        description: "true si el modificador se puede ordenar; false en otro caso"
				},
				precio: {
					bsonType: "number",
					minimum: 0,
			        description: "Precio del modificador"
				},
			}
		}
	}
})


db.createCollection("menus", {
	validator: {
		$jsonSchema: {	
			bsonType: "object",
			required: ["nombre", "categoria", "disponibilidad", "precio"],
			properties: {
				nombre: {
					bsonType: "string",
					maxLength: 40,
			        description: "Nombre del menu"		
				},
				categoria: {
					bsonType: "string",
					description: "categoria del menu: entrada, plato fuerte, postre, bebida"
				},
				notas: {
					bsonType: ["string"],
					maxLength: 80,
			        description: "Notas al menu"		
				},
				disponibilidad: {
					bsonType: "bool",
			        description: "true si el menu se puede ordenar; false en otro caso"
				},
				precio: {
					bsonType: "number",
					minimum: 0,
			        description: "Precio del menu"
				},
				imagen: {
					bsonType: ["string"],
					maxLength: 200,
					description: "url de la imagen"
				}
			}
		}
	}
})


db.createCollection("ordenes", {
	validator: {
		$jsonSchema: {	
			bsonType: "object",
			required: ["usuario", "estatus", "menu", "metodoPago", "costo", "direccionEnvio"],
			properties: {
				usuario: {
					bsonType: "string",
					maxLength: 24,
					description: "usuario final que posee esta orden"
				},
				estatus: {
					bsonType: "string",
					maxLength: 20,
					description: "estatus de la orden: preparando y cancelado"
				},
				metodoPago: {
					bsonType: "string",
					maxLength: 20,
					description: "tarjeta crédito o contra entrega"
				},
				menu: {
					bsonType: "object",
					description: "El menú"
				},
				modificadores: {
					bsonType: "object",
					description: "Modificadores al menú"
				},
				costo: {
					bsonType: "object",
					description: "Costo del menú"
				},
				direccionEnvio: {
					bsonType: "string",
					maxLength: 50,
					description: "Dirección a donde se entregará el menú"
				},
			}
		}
	}
});