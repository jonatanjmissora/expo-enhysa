Hacer los componentes cuando no hay datos, no tecnico, no empresas, no instrumentos
animaciones

cuando creo empresa o instrumento, que me devuelva a /perfil?actual=empresas o /perfil?actual=instrumentos

Necesitaria que me ayudes a re estructurar mis carpetas y rutas
- tengo 2 carpetas en donde utilizo Tab, que son (inicio) e (iluminacion)
- luego rutas simples, sin Tab visible, que son /tecnico, /empresa,  /instrumento, e /iluminacion.

mi estructura hasta aqui es la siguiente, y me gustaria ir por partes, de lo mas basico a lo mas complejo.
app
	└ (inicio)
 	      ├ index
 	      ├ perfil
 	      └ suscripcion
	└ (iluminacion)
 	      ├ iluminacion
 	      ├ informes
 	      └ nuevo
	└ tecnico
 	      ├ nuevo
 	      └ editar
	└ empresa
 	      ├ nuevo
 	      ├ editar
 	      └ empresa
	└ instrumento
 	      ├ nuevo
 	      ├ editar
 	      └ instrumento
	└ iluminacion
		└ [id]
 			├ general
 			├ medicion
 			└ conclusion

 en (inicio)/perfil tengo opcion de crear nuevos, o editar a tecnico, empresas o instrumentos. Por lo que segun la accion que este desarrollando me llevan a distintas rutas dentro de /tecnico/, /empresa/ e /instrumento/. Alli tengo sus correspondientes formularios para ejecutar dicha accion.
 	
Para mejorar la organizacion, ¿crees que aqui deberia de hacer una carpeta /(perfil), y luego dentro de ella, /tecnico/, /empresa/ e /instrumento/ ? 