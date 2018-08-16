/*=============================================
=            Clase TTransformacion            =
=============================================*/

  
  class TTransformacion extends TEntidad
  {

      /**
       *
       * Constructor y metodos de clase
       *
       */
      

      constructor(){
        super();
        // Cargar identidad
        this.matrix = mat4.identity(mat4.create());
        this.auxiliar = mat4.identity(mat4.create());
        this.inicial = mat4.identity(mat4.create());
        this.contador = 0;          
      }

      destructor(){
        this.matrix = null;
      }

      // Cargar una matriz dada
      cargar(m){
        this.matrix = m;    
      }

      // Trasponer matriz
      trasponer(m){
        mat4.transpose(this.matrix, m);
      }

      // Invertir matriz
      invertir(m){
        mat4.invert(this.matrix, m);
      }

      // Multiplicar Matriz * vector
      multiplicarmv(v){
        mat4.multiply(this.matrix, v);
      }

      // Multiplicar Matriz * Matriz
      multiplicarmm(m){
        mat4.multiply(this.matrix, m);
      }

      //Método para calcular el grado en radianes
      degToRad(d) 
      {
          return d * Math.PI / 180;
      }

      getMatrix()
      {
          return this.matrix;
      }

      setMatrix(m){
        mat4.set(this.matrix,m);
      }

      /**
       *
       * Transformaciones basicas
       *
       */

      rotacion(v)
      {

          //Rotacion en el eje X
          mat4.rotate(this.matrix, this.degToRad(v[0]), [1, 0, 0]);

          //Rotacion en el eje Y
          mat4.rotate(this.matrix, this.degToRad(v[1]), [0, 1, 0]);
          
          //Rotacion en el eje Z
          mat4.rotate(this.matrix, this.degToRad(v[2]), [0, 0, 1]);
      }

      //Metodo escalar
      escalado(v)
      {
          mat4.scale(this.matrix, v);
      }

      //Metodo Traslacion
      traslacion(v)
      {
        
          mat4.translate(this.matrix, v);
          this.contador++;
          if(this.contador==1){
            // Cogemos la matriz inicial
            mat4.set(this.matrix,this.inicial);
          }
      }

      lastModelMatrix(){
        mat4.set(pila[pila.length - 1], modelMatrix);
      }

      // Metodo para volver a la matriz inicial
      // -> se activa cuando pulsamos el boton de reiniciar en la UI
      reiniciar(){
        mat4.set(this.inicial,this.matrix);
      }

      beginDraw()
      {
          // Creamos una matriz y le asignamos la ModelMatrix
          var aux = mat4.create();
          mat4.set(modelMatrix, aux);
          // apilamos la matriz
          apilar(aux); 
          mat4.multiply(aux, this.matrix, modelMatrix);
      }

      endDraw()
      { 
        // Sustituimos por la modelMatrix y desapilamos
        mat4.set(pila[pila.length - 1], modelMatrix);
        desapilar();
       }
  }