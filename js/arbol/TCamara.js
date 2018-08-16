/*===================================
=            Clase TCamara            =
===================================*/

  class TCamara extends TEntidad
  {

	/**
	 *
	 * Constructor y metodos de clase
	 * -> para la clase camara se ha seguido el manual del libro, tema 4 http://voxelent.com/resources/books-code-examples/
	 */

      constructor(nodoPadre)
      {
          super();   
         
          //Creamos la matriz y le asignamos la matriz identidad
          this.matrixaux = mat4.create();
          mat4.identity(this.matrixaux);
          this.matrix=this.matrixaux; // Matriz camara
          this.padre = nodoPadre;
          this.posicion = [];

          this.perspectiva = mat4.create();    
      }

      destructor()
      {
        this.matrix = null;
      }

      setPosicion(p){
        vec3.set(p,this.posicion);
      }

      getPosicion(){
        return this.posicion;
      }
      
      setMatrix(m)
      {
          this.matrix = m;
      }

      getMatrix()
      {
          return this.matrix;
      }

      setPerspectiva(angulo, cercania, lejania)
      { 
        // Cambia la perspectiva y lo almacena en la matriz perspectiva 
         mat4.perspective(angulo, gl.viewportWidth / gl.viewportHeight, cercania, lejania, pMatrix);
      }

      getPerspectiva(){
        return this.perspectiva;
      }

      getVista(){
        // La model view la sacamos como la inversa de la matriz camara
        var mv = mat4.create();
        mat4.inverse(this.matrix, mv);
        // La almacenamos en la viewMatrix
        mat4.set(mv,viewMatrix);
        return mv;
      }

      beginDraw(){}

      endDraw(){}

}