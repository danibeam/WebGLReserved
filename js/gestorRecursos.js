/*================================================
=            Clase Gestor de Recursos            =
================================================*/

class TGestorRecursos 
{

	/**
	 *
	 * Constructor y metodos de clase
	 *
	 */
	
	constructor()
	{
		this.recursosMalla = null;
		this.recursosTextura = null;
	}


	//Almacenamos una malla en el array de mallas si existe y no se llama igual que alguna que ya está dentro del array 
	//y llamamos al método CargarFichero
	
	getRecurso(r) 
	{
		var rec = null;
		if(this.recursosMalla == null)
		{
			this.recursosMalla = [];

		}
		
		if(r != null)
		{
			for(var i=0; i<this.recursosMalla.length; i++)
			{
				if(this.recursosMalla[i] != null)
				{
					if(this.recursosMalla[i].getNombre() != null)
					{
						if(this.recursosMalla[i].getNombre().localeCompare(r) == 0)
						{
							rec = this.recursosMalla[i];
							break;
						}
					}
				}
			}

			
			if(rec == null)
			{
				rec = new TRecursoMalla(r);
				rec.cargarFichero(r);
				this.recursosMalla.push(rec);

			}
		}

		return rec;
	}

	//Almacenamos una textura en el array de textura si existe y no se llama igual que alguna que ya está dentro del array 
	//y llamamos al método CargarTextura

	getRecursoTextura(t)
	{
		var rec = null;
		if(this.recursosTextura == null)
		{
			this.recursosTextura = [];
		}


		if(t != null)
		{
			for(var i=0; i<this.recursosTextura.length; i++)
			{
				if(this.recursosTextura[i] != null)
				{
					
					if(this.recursosTextura[i].getNombreT().localeCompare(t) == 0)
					{
						rec = this.recursosTextura[i];
						break;
					}
						
				}
			}

			if(rec == null)
			{
				rec = new TRecursoTextura(t);
				rec.setTexture(t);
				this.recursosTextura.push(rec);

			}
		}
	
		return rec;
	}

}

class TRecursoMalla 
{
	constructor(nombre)
	{
		//Pasamos por parámetro el nombre de la malla y creamos los buffers

		this.nombre = nombre;
		this.meshVertexTextureCoordBuffer = null;
		this.meshVertexPositionBuffer = null;
		this.meshVertexNormalBuffer = null;
		this.meshVertexIndexBuffer = null;
	}

	getMeshVertexPositionBuffer()
	{
		return this.meshVertexPositionBuffer;
	}
	
	getMeshVertexNormalBuffer()
	{
		return this.meshVertexNormalBuffer;
	}
	
	getMeshVertexIndexBuffer()
	{
		return this.meshVertexIndexBuffer;
	}
	
	getMeshVertexTextureCoordBuffer()
	{
		return this.meshVertexTextureCoordBuffer;
	}

	getNombre()
	{
		return this.nombre; 
	}

	setNombre(n){
		if(n != null)
		{
			this.nombre = n;
		} 
	}

	//Aquí empezamos a cargar el JSON para rellenar los buffeeers para luego cargarlos.
	//Para cargar el JSON hemos seguido el siguiente ejemplo del libro de WEBGL
	//http://voxelent.com/html/beginners-guide/chapter_2/ch2_AjaxJSON.html


	cargarFichero(fichero){
		if(fichero != null)
		{

			var request = new XMLHttpRequest();
	        request.open("GET", fichero);
	        var gestor = this;

	        request.onreadystatechange = function () 
	        {
	            if (request.readyState == 4) 
	            {
	                // Si la peticion es correcta, llamar a funcion para manejar parametros del JSON
	                gestor.manejarJSON(JSON.parse(request.responseText));
	                
	            }
	        }
	        request.send();
		}
	}

	
	manejarJSON(fichero){
		

		//Estos ifs sirven para saber la estructura del JSON que vamos a cargar
		// en función de donde estén situados los buffers entraremos a un if u otro.
		if(fichero.meshes != null)
		{

			var indices=fichero.meshes[0].indices;
			var vertexNormals = fichero.meshes[0].vertexNormals;
			var vertexPositions = fichero.meshes[0].vertexPositions;
			var  vertexTextureCoords = fichero.meshes[0].vertexPositions;
		
		}

		else if(fichero.data != null)
		{
		
			var indices=fichero.data.index.array;
			var vertexNormals = fichero.data.attributes.normal.array;
			var vertexPositions = fichero.data.attributes.position.array;
			var  vertexTextureCoords = fichero.data.attributes.uv.array;

		}

		else
		{
			var indices=fichero.indices;
			var vertexNormals = fichero.vertexNormals;
			var vertexPositions = fichero.vertexPositions;
			var  vertexTextureCoords = fichero.vertexTextureCoords;
		}

		//RELENAMOS LOS BUFFERS
		
		// Buffer de Indices
		this.meshVertexIndexBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshVertexIndexBuffer);
	    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	    this.meshVertexIndexBuffer.itemSize = 1;
	    this.meshVertexIndexBuffer.numItems = indices.length;
	   gl.bindBuffer(gl.ARRAY_BUFFER, null);


	    // Buffer de Normales
	    this.meshVertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVertexNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	    this.meshVertexNormalBuffer.itemSize = 3;
	    this.meshVertexNormalBuffer.numItems = vertexNormals.length / 3;

	    // Buffer de Posiciones
	    this.meshVertexPositionBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVertexPositionBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
	    this.meshVertexPositionBuffer.itemSize = 3;
	    this.meshVertexPositionBuffer.numItems = vertexPositions.length / 3;
	    gl.bindBuffer(gl.ARRAY_BUFFER, null);

	    // Buffer de coordenadas de textura
	    this.meshVertexTextureCoordBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.meshVertexTextureCoordBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
	    this.meshVertexTextureCoordBuffer.itemSize = 2;
	    this.meshVertexTextureCoordBuffer.numItems = vertexTextureCoords.length / 2;
	}

}


class TRecursoTextura
{
	constructor(rutaTextura){
		this.textura = null;
		this.nombreTextura = rutaTextura;
	}
	
	setNombreTextura(n){
		this.nombreTextura = n;
	}

	getNombreTextura()
	{
		return this.nombreTextura;
	}

	getTextureMesh()
	{
		return this.textura;
	}


	// Metodo para cargar una textura e introducirla a una malla
	//Para realizar estas dos funciones hemos seguido el siguiente ejemplo del libro de WEBGL
	//http://voxelent.com/html/beginners-guide/chapter_7/ch7_Texture_Filters.html
	//Tambien nos hemos basado en un manual del MDN de Mozilla sobre carga y tratamiento de texturas
	//https://developer.mozilla.org/es/docs/Web/API/WebGL_API/Tutorial/Wtilizando_texturas_en_WebGL
	

	setTexture(file){
		this.textura = gl.createTexture();
        this.textura.image = new Image();
       
        var auxRecurso = this;
        this.textura.image.onload = function () 
        {
            // Una vez cargada la imagen correctamente, llamamos a la funcion para manejar la imagen de la textura
            auxRecurso.manejarTextura();
           
        }
        this.textura.image.src = file;

	}

	manejarTextura()
	{
		
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, this.textura);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textura.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
		
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);

	}


}
class TRecursoMaterial{
	// Vacia -> No usaremos materiales en el motor
}
