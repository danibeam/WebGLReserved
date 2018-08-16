
/*===================================
=            Clase TNodo            =
===================================*/


class TNodo{

/**
 *
 * Constructor y metodos de clase
 * Esta clase se hizo siguiendo las recomendaciones de las diapositivas de la asignatura
 */

	constructor(entidad, hijos, padre){
		// Definimos las variables de clase
		this.removable = false;	// Si el nodo va a ser eliminado
		this.entidad = entidad;
		hijos != null ? this.hijos = hijos : this.hijos = [];
		this.padre = padre;
	}

	destructor(){
		this.removable = false;
		this.entidad = null;
		this.hijos = null;
		this.padre = null;
	}

	// Se va a eliminar el nodo
	getRemovable(){
		return this.removable;
	}

	// Hacer el nodo 'eliminable'
	setRemovable(){
		this.removable ? false : true;
	}

	/**
	 *
	 * Metodos Entidad
	 *
	 */
	
	getEntidad(){
		return this.entidad;
	}

	setEntidad(entidad){
		this.entidad = entidad;
	}

	// Eliminar nodo
	remNodo(){
      if(this.padre != null && this.padre.tieneHijos()){
        if(this.tieneHijos()){
          for(var i=0; i<this.hijos.length; i++){
            this.hijos[i].setPadre(padre);
            this.padre.addHijo(hijos[i]);
          }
        }
        var aux = this.padre.getHijos().indexOf(this); //indexOf -> obtener el indice del objeto pasado por parametros en el array
        this.padre.getHijos().splice(aux, 1); // Borra elementos segun la posicion del array recibida
      }else{
        if(this.tieneHijos()){
          for(var i=0; i<this.hijos.length; i++){
            this.hijos[i].setPadre(null);
          }
        }
      }
    }

	/**
	 *
	 * Metodos Padre
	 *
	 */

	getPadre(){
		return this.padre;
	}

	setPadre(padre){
		this.padre = padre;
	}


	/**
	 *
	 * Metodos Hijos
	 *
	 */

 	getHijos(){
 		return this.hijos;
 	}

	addHijo(nodo){
		var cantidad;	// Cantidad de hijos
		if(nodo != null){
			if(this.hijos == null){
				this.hijos = [];
			}
			this.hijos.push(nodo);	// Anyadir hijo
			cantidad = this.hijos.length;
			
		}
		else{
			// Error (no hay nodo)
			cantidad = 0;
		}
		return cantidad;	// Devuelve cantidad de hijos
	}

	addHijo3(hijo)
	{
		// Para el metodo unir (TMotor.js 111)
		hijo.padre=this;
		this.hijos.push(hijo);
		return hijo; 
	}


	remHijo(nodo){
		var cantidad;
		if(nodo != null){
			if(this.hijos.length != null){
	          for(var i = 0; i < this.hijos.length; i++){
	            if(this.hijos[i].getRemovable()){
	              this.hijos[i].setRemovable();
	              this.hijos.splice(i, 1);	// Eliminar el nodo
	            }
	          }
	          cantidad = this.hijos.length;
	        }
        }
        else{
        	// Error (no hay nodo)
        	cantidad = 0;
        }
        return cantidad;
	}

	/**
	 *
	 * Dibujar Entidad asociada
	 *
	 */

	draw(){

	    if(this.entidad != null)
	    {
        	this.entidad.beginDraw();
        }
		
		
		for(var i = 0; i < this.hijos.length; i++){
			this.hijos[i].draw();
		}

		if(this.entidad != null){
            this.entidad.endDraw();
        }
	}

}
