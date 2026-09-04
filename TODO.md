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
	└ (perfil)
 	      └ tecnico
		  	├ index
 	      	├ nuevo
 	      	└ editar
 	      └ empresa
			├ nuevo
			├ editar
			└ index
 	      └ instrumento
			├ nuevo
 	      	├ editar
 	      	└ index
	
	└ iluminacion
		└ [id]
 			├ general
 			├ medicion
 			└ conclusion

 en (inicio)/perfil tengo opcion de crear nuevos, o editar a tecnico, empresas o instrumentos. Por lo que segun la accion que este desarrollando me llevan a distintas rutas dentro de /tecnico/, /empresa/ e /instrumento/. Alli tengo sus correspondientes formularios para ejecutar dicha accion.
 	
Para mejorar la organizacion, ¿crees que aqui deberia de hacer una carpeta /(perfil), y luego dentro de ella, /tecnico/, /empresa/ e /instrumento/ ? 

Para generar un reporte completo, necesitaremos varios formularios ya que la recoleccion de datos es considerable. Cada formulario puede encontrarse en distintas rutas. Un informe completo no se guarda solo en la tabla de "informe-iluminacion", sino que tambien necesitamos datos de las tablas "area-iluminacion" y/o "localizadas-iluminacion". Para generar un informe, un pdf que el usuario luego pueda descargar, necesitaremos de los datos de las 2 o 3 tablas. Un informe puede contar con mas de 1 area-iluminacion, o mas de 1 localizadas-iluminacion.

Para tal fin, la division de formularios tiene la siguiente particularidad:
- en la ruta /(iluminacion)/nuevo tengo un estado llamado step (1,2 o 3) que me permite dividir el informe en 3 pasos.
- en el step1, muestro el componente IluminacionGeneral, que es el encargado de recopilar los datos generales del informe.
- en el step2, muestro el componente IluminacionMedicion, que es el encargado de recopilar los datos de medicion del informe.
- en el step3, muestro el componente IluminacionConclusion, que es el encargado de recopilar los datos de conclusion del informe.

En el step1 completo un formulario, que llenara varios de los datos de la tabla informe-iluminacion, ademas de crear el informe en esta tabla, generando un unico id para dicho informe. Luego en el onSubmit, ademas de crear dicho dato en la tabla, paso el estado "step" a 2, que me permite renderizar el componente IluminacionMedicion en la misma ruta /(iluminacion)/nuevo. En dicho componente, tengo la posibilidad de agregar datos a las tablas "area-iluminacion" y "localizada-iluminacion", siempre asociados al id del informe obtenido en el "step" 1. En IluminacionMedicion no se tocan datos de la tabla "informe-iluminacion". Una vez realizados los datos de las tablas "area-iluminacion" y/o "localizada-iluminacion" damos siguiente y pasamos el "step" a 3. Se renderiza el componente IluminacionConclusion en donde completaremos un formulario para terminar de completar los datos de la tabla "informe-iluminacion". Dicho formulario se completara segun lo que hayamos visto en los anteriores formularios. Una vez completo, terminaremos con la recoleccion de informacion para generar un informe final, y regresaremos el valor de "step" a 1.
Mi pregunta es la siguiente:
como debo de estructurar mis carpetas de expo router, para que cuando estoy en step 1 y ruta /(iluminacion)/nuevo; genero el id del informe, paso el step a 2 y renderizo IluminacionMedicion en la misma ruta /(iluminacion)/nuevo. Ahora bien, cuando quiero ingresar datos a las tablas "area-iluminacion" y "localizadas-iluminacion" voy a necesitar el id del informe-iluminacion que genere en el step 1. No hay problema, porque se lo paso como argumento a los componentes. Sin embargo, en IluminacionMedicion, tengo la posibilidad de crear varios "area-iluminacion" o varios "localizada-iluminacion". Por lo que me dirijo a /iluminacion/[id]/area/nuevo, y a /iluminacion/[id]/localizada/nuevo
Quisiera saber si mi implementacion es correcta o no. Como son las buenas practicas? porque veo que estoy mezclando estados, con rutas, y no se si hay mejor forma de hacer la estructura de rutas.
En resumen, tengo la ruta /(iluminacion)/nuevo, que es parte de un Tab en (iluminacion) y esta ruta renderiza condicionalmente 3 componentes segun el step. Pero como el id solo se crea en step 1, y en step 2 puedo redirigirme a los formularios para crear areas o localizadas, necesito ir a una ruta en donde conozca el id del informe, por eso renderizo en la siguiente ruta /iluminacion/[id]/...