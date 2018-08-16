/*====================================
=            Clase TMalla            =
====================================*/


  class TMalla extends TEntidad
  {

/**
 *
 * Constructor y metodos de clase
 *
 */
      
      constructor(Recurso, nodoPadre)
      {
        super();

        this.nombreRecurso = Recurso;
        this.malla = null;
        this.padre = nodoPadre;

        this.nombreTextura = gl.createTexture();
        this.textura = null;
      }

      destructor(){
        this.nombreRecurso = null;
        this.malla = null;
        this.padre = null;
      }

      getRecursoMalla(){
        return this.nombreRecurso;
      }

      getRecursoTextura(){
        return this.nombreTextura;
      }
      
      cargarMalla(){
        // Cargar un recurso (malla) con el gestor de recursos
        this.malla = gestorRecursos.getRecurso(this.getRecursoMalla());
      }

      traslacion(v)
      {
        
          mat4.translate(viewMatrix, v);
      }

      // metodo de inicializacion de matrices
      setMatrixUniforms(){
          var aux = mat4.create();
          aux = mat4.identity(aux);

          // Matriz auxiliar para model view
          var TMVmatrix = mat4.multiply(viewMatrix, modelMatrix, TMVmatrix);
          
          gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, TMVmatrix);
          gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
         
          // Matriz de normales -> inversa de la traspuesta de modelView
          var normalMatrix = mat3.create();
          mat4.toInverseMat3(TMVmatrix, normalMatrix);
          mat3.transpose(normalMatrix);
         
          gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
      }  

      setMalla(nombreMalla){
        // Cargar un recurso (malla) con el gestor de recursos
        this.malla = gestorRecursos.getRecurso(nombreMalla);
      }

      setTextura(rutaTextura){
        // Cambiar el recurso de la textura (Gestor de recursos)
        this.textura = gestorRecursos.getRecursoTextura(rutaTextura);

      } 

      /*----------  Dibujado de la malla  ----------*/

      //Para el dibujado de la malla hemos seguido el siguiente ejemplo del libro -> http://voxelent.com/html/beginners-guide/chapter_2/ch2_Cone.html
      
      beginDraw(){

        if(this.malla== null)
        {
          return;
        }

          var bufferTexturas = this.malla.getMeshVertexTextureCoordBuffer();
          var bufferPosiciones = this.malla.getMeshVertexPositionBuffer();
          var bufferNormales = this.malla.getMeshVertexNormalBuffer();
          var bufferIndices = this.malla.getMeshVertexIndexBuffer();
         
          // Comprobar que todo se inicializa (carga la malla)
          if(bufferTexturas == null || bufferPosiciones == null || bufferNormales == null || bufferIndices == null){
            return;
          }

           if(this.textura.getTextureMesh() != null){
                gl.uniform1i(shaderProgram.useTexturesUniform, true);//Textura confirmada
                gl.enableVertexAttribArray(shaderProgram.aTextureCoord);
                gl.bindBuffer(gl.ARRAY_BUFFER, bufferTexturas);
                gl.vertexAttribPointer(shaderProgram.aTextureCoord, bufferTexturas.itemSize, gl.FLOAT, false, 0, 0);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.textura.getTextureMesh());
                gl.uniform1i(shaderProgram.uSampler, 0);

                gl.uniform1i(shaderProgram.samplerUniform, 0);

          }else{
              gl.uniform1i(shaderProgram.useTexturesUniform, false);
          }



          // Pasamos los buffer al shader
           
          gl.bindBuffer(gl.ARRAY_BUFFER, bufferPosiciones);
          gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, bufferPosiciones.itemSize, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
          gl.bindBuffer(gl.ARRAY_BUFFER, bufferNormales);
          gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, bufferNormales.itemSize, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
           
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
  
          // llamamos al metodo de inicializacion de matrices
          this.setMatrixUniforms();
          
          // pintamos la malla
          gl.drawElements(gl.TRIANGLES, bufferIndices.numItems, gl.UNSIGNED_SHORT, 0);

      }

      endDraw(){}
    }