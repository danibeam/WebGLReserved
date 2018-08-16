/*==========================================
=            Interfaz Motor TAG            =
==========================================*/


function crearEscena()
{
	var canvas= document.getElementById("app");
    var gl = canvas.getContext("webgl");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

	if(canvas != null && canvas instanceof HTMLCanvasElement)
	{
		initGL(canvas);
		iniciarShaders();

        gl.clearColor(0.5, 0.5, 0.5, 0.9);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
	else
	{
		alert("Es necesario indicar la id del canvas en donde se representa la escena");
	}
}


/*----------  Inicializacion  ----------*/

/**
 *
 * Para la parte de inicializacion de shaders
 * Nos basamos en el siguiente ejemplo: https://sites.google.com/site/desarrolloenwebgl/tutorial-1/2---primer-programa
 */

function initGL(canvas) 
{
	gl = canvas.getContext("experimental-webgl");
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
   
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


// Con esta funcion recogemos los shaders del html
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);	
    
    if (!shaderScript) 
    {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) 
    {
        if (k.nodeType == 3) 
        {
            str += k.textContent;
        }

        k = k.nextSibling;
    }

    var shader;
    
    //Identificamos si el shader es de tipo fragment o vertex

    if (shaderScript.type == "x-shader/x-fragment") 
    {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } 
    
    else if (shaderScript.type == "x-shader/x-vertex") 
    {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } 

    else 
    {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
    {
        console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}



// Inicializamos los shaders y sus variables
function iniciarShaders() {
	var fragmentShader = getShader(gl,"per-fragment-lighting-fs");
	var vertexShader = getShader(gl,"per-fragment-lighting-vs");

	shaderProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) 
	{
	    alert("No es posible inicializar los shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

	shaderProgram.aTextureCoord = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.aTextureCoord);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
   	shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");
    shaderProgram.useTexturesUniform = gl.getUniformLocation(shaderProgram, "uUseTextures");

    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");

  	shaderProgram.nDirectionalLightsUniform = gl.getUniformLocation(shaderProgram, "uNDirectionalLights");
    shaderProgram.sceneDirectionalLightsUniform = gl.getUniformLocation(shaderProgram, "uSceneDirectionalLights");
    
    shaderProgram.nLightsUniform = gl.getUniformLocation(shaderProgram, "uNLights");
    shaderProgram.scenePointLightsUniform = gl.getUniformLocation(shaderProgram, "uScenePointLights");

   shaderProgram.uMaterialDiffuse = gl.getUniformLocation(shaderProgram, "uMaterialDiffuse");
    shaderProgram.uLightDiffuse = gl.getUniformLocation(shaderProgram, "uLightDiffuse");
    shaderProgram.uLightDirection = gl.getUniformLocation(shaderProgram, "uLightDirection");

    shaderProgram.uMaterialAmbient = gl.getUniformLocation(shaderProgram, "uMaterialAmbient");	
	shaderProgram.uMaterialSpecular	= gl.getUniformLocation(shaderProgram, "uMaterialSpecular");
	
	shaderProgram.uShininess = gl.getUniformLocation(shaderProgram, "uShininess");

	shaderProgram.uLightDiffuse  = gl.getUniformLocation(shaderProgram, "uLightDiffuse");
	shaderProgram.uLightSpecular = gl.getUniformLocation(shaderProgram, "uLightSpecular");
	shaderProgram.uLightDirection = gl.getUniformLocation(shaderProgram, "uLightDirection");

}


//En la fachada tenemos los métodos de creación de las distintas partes de nuestra escena y algunos metodos para cambiar sus valores
//Nodo,Malla,Camara,Transformacion y Luz.
class TFachada{
	/**
	 *
	 * Metodos de clase
	 *
	 */
	
	constructor(escena, gestor){
		this.gestorRecursos = gestor;
       	this.escena = escena;

	}

	destructor(){
		this.escena = null;
		this.gestorRecursos = null;
	}

	getGestorRecursos(){
		return this.gestor;
	}

	/*----------  Metodos Nodos  ----------*/

	 crearNodo(nodoPadre, entidad){
		var nodo = null;
		if(this.escena != null)
		{
				if(entidad != null && nodoPadre != null && nodoPadre instanceof TNodo){
					// crear nodo (sin hijos) y asociarle la entidad
					var nodo = new TNodo(entidad, null, nodoPadre);
					// anyadir el nuevo nodo como hijo del nodo padre
					nodoPadre.addHijo(nodo); 
				}
				else{
					if(entidad == null){alert('La entidad no se ha declarado');}
					if(nodoPadre == null){alert('El nodo padre no se ha declarado');}
			}
		}
		else
		{
			// Escena no valida
			return null;
		}
		// devolver la referencia al nodo creado
		return nodo;
	 }


	/*----------  Metodos transformaciones  ----------*/

	crearRotacion(nodoPadre, vector){
		var transformacion = null;
		if(this.escena != null)
		{
			if(vector == null)
			{
				if(nodoPadre instanceof TNodo)
				{
					vector = vec3.create();
				}
			}
		
			if(nodoPadre != null)
			{
				var entidad = new TTransformacion();
				entidad.rotacion(vector);
			
				transformacion = new TNodo (entidad, null, nodoPadre);
				if(!nodoPadre.addHijo(transformacion))
				{
					transformacion.remTNodo();
					alert("El nodo padre (" + nodoPadre + ") debe ser una transformacion o el nodo raiz");
					transformacion = null;
				}
				
			}
			
		}
		
		else
		{
			return null; // Escena no valida
		}
		return transformacion;
	}

	crearTraslacion(nodoPadre, vector){
		var transformacion = null;
		if(this.escena!=null)
		{
				if(vector == null)
				{
					if(nodoPadre instanceof TNodo)
					{
							vector = vec3.create();
					}
				}

				if(nodoPadre != null)
				{
					
						var entidad = new TTransformacion();
						entidad.traslacion(vector);
					
						transformacion = new TNodo (entidad, null, nodoPadre);
						if(!nodoPadre.addHijo(transformacion))
						{
							transformacion.remTNodo();
							alert("El nodo padre debe ser una transformacion o el nodo raiz (crearTraslacion)");
							transformacion = null;
						}
					
				}
			}
		else
		{
			return null; // Escena no valida
		}
		return transformacion;
	}

	crearEscalado(nodoPadre, vector){
		var transformacion = null;

		if(this.escena!=null)
		{
			if(vector == null)
			{
				vector = [1.0, 1.0, 1.0];
			}
			
			if(nodoPadre != null)
			{
				if(nodoPadre instanceof TNodo)
				{
					var entidad = new TTransformacion();
					entidad.escalado(vector);
				
					transformacion = new TNodo (entidad, null, nodoPadre);
					if(!nodoPadre.addHijo(transformacion))
					{
						transformacion.remTNodo();
						alert("El nodo padre debe ser una transformacion o el nodo raiz (crearEscalado)");
						transformacion = null;
					}
				}
			}
		}
		else
		{
			return null; // Escena no valida
		}
		return transformacion;
	}

	// Modificar parametros de una transformacion dada
	editarTransformacion(nodo, vector, tipo){
		if(nodo != null)
		{
			if(nodo.getEntidad() != null)
			{
				if(nodo.getEntidad() instanceof TTransformacion)
				{
					if(vector != null)
					{
						switch (tipo) 
						{
							case 'traslacion':
								nodo.getEntidad().traslacion(vector);
								break;
						
							case 'rotacion':
								nodo.getEntidad().rotacion(vector);
								break;
						
							case 'escalado':
								nodo.getEntidad().escalado(vector);
								break;
						
							default:
								alert("No se ha podido editar la transformacion de " + tipo);
								break;
						}
					}
				}
			}
		}
			else
			{
				return null; // Escena no valida
			}
	}

	/*----------  Metodos Luz  ----------*/

	// Crear nueva luz (sin valores de intensidad)
	crearLuz(nodoPadre){
		var luz = null;
		if(this.escena != null)
		{
			if(nodoPadre != null)
			{
				if(nodoPadre instanceof TNodo)
				{
					var entidad = new TLuz();
					luz = new TNodo (entidad, null, nodoPadre);
					if(!nodoPadre.addHijo(luz))
					{
						luz.remNodo();
						alert("El nodo padre introducido (" + nodoPadre + ") debe ser una transformacion o el nodo raiz");
						luz = null;
					}
					else
					{
						this.escena.addLuz(luz);

					}
				}
			}
			
		}

		else
		{
			return null; // Escena no valida
		}
		return luz;
	}

	// Modificar valores de intensidad de la luz (vec3)
	editarLuz(luz,p,d,es){
	   	luz.getEntidad().setNormal(p);
	    luz.getEntidad().setIntensidadDifusa(d);
	    luz.getEntidad().setIntensidadEspecular(es);
	    
	}


	/*----------  Metodos Camara  ----------*/

	crearCamara(nodoPadre){
		var camara = null;
		if(this.escena != null)
		{
			if(nodoPadre != null)
			{
				if(nodoPadre instanceof TNodo)
				{
					var entidad = new TCamara(nodoPadre);

					camara = new TNodo (entidad, null, nodoPadre);

					if(!nodoPadre.addHijo(camara))
					{
						camara.remTNodo();
						alert("El nodo padre introducido (" + nodoPadre + ") debe ser una transformacion o el nodo raiz");
						camara = null;
					}
					else
					{

						this.escena.addCamara(entidad);

					}
				}
			}
			
		}

		else
		{
			return null; // Escena no valida
		}
		return camara;
	}

	// Con este metodo podemos cambiar la perspectiva desde la interfaz
	cambiarPerspectiva(camara, angle, near, far){
		var v = false;
		if(camara != null && angle <= 360 && camara.getEntidad() != null)
		{
			if(camara.getEntidad() instanceof TCamara){
				camara.getEntidad().setPerspectiva(angle, near, far);
			}
			v = true;
		}
		
		return v;
	}

	/*----------  Metodos Malla  ----------*/

	crearMalla(nodoPadre, nombreFichero,textura){
		var malla = null;
		if(nombreFichero != null)
		{
			if(this.escena != null)
			{
				if(nodoPadre != null)
				{
					if(nodoPadre instanceof TNodo)
					{
						var entidad = new TMalla(nombreFichero, nodoPadre);

						malla = new TNodo (entidad,null,nodoPadre);
						
						entidad.setTextura(textura);
						entidad.cargarMalla();
						
						malla.setEntidad(entidad);
					}
				}				
			}
		}
		
		else
		{
			alert("La ruta del archivo JSON (" + nombreFichero + ") no es valida");
		}
		return malla;
	}
}

