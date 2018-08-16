 var escena = null;
 var gl = null;
 var gestorRecursos = new TGestorRecursos();

 // MATRIZ MODEL
 var modelMatrix = mat4.create();
 modelMatrix = mat4.identity(modelMatrix);

 var pivote = mat4.create();
 pivote = mat4.identity(pivote);

 //CREACION DE VIEWMATRIX
 var viewMatrix = mat4.create();
 viewMatrix = mat4.identity(viewMatrix);

 // MATRIZ DE PROYECCION
 var pMatrix = mat4.create();
 pMatrix = mat4.identity(pMatrix);

//Pila de matrices
 var pila = [];

  function apilar(m){
      var copy = mat4.create();
      mat4.set(m, copy);
      pila.push(m);
  }
  function desapilar(){
      if (pila.length == 0) {
          throw "Invalid popMatrix!";
      }else{
          pila.pop();
      }
  }

  class Tmotor{

    constructor(){
      this.escenasMotor = [];
    }

    getEscenas(){
        return this.escenasMotor;
    }
  
    setEscena(e){
        if(e != null && e instanceof TEscena){
            this.escenasMotor.push(e);
        }
    }
  }

// Motor de la escena
var motor = new Tmotor();

  class TEscena{
  
      constructor()
      {
	      this.arbol = new TNodo(null,null,null);

	      // Luces
	      this.luces = [];
        // Luz ambiental
        this.luzAmbiental = [0.5,0.5,0.5];	         

	      // Camaras
	      this.camaras = null;
	         
        motor.setEscena(this);
	         
	    }

      getArbol(){
         return this.arbol;
      }

      getLuces(){
        return this.luces;
      }

      getCamaras(){
        return this.camaras;
      }

      getMallas(){
        return this.mallas;
      }

      // Anyadir elementos a la escena
      addLuz(luz){
          if(luz.getEntidad() instanceof TLuz){
          this.luces.push(luz);
          }
        }

      getLuzAmbiental(){
        return this.luzAmbiental;
      }

      setLuzAmbiental(v){
        if(v.length == 3){
          vec3.set(v, this.ambiental);
        } 
      }

      addCamara(camara){
          this.camaras=camara;
      }

      unir(padre,hijo)
      {
        
        var nodo=padre.addHijo3(hijo);
        return nodo;
      }

      // Dibujado de la escena
      drawEscena(){ 
          gl.clearColor(0.1,0.1,0.1, 1.0);
          gl.clearDepth(100.0);
          gl.enable(gl.DEPTH_TEST);
          gl.depthFunc(gl.LEQUAL);
          

          gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

          this.arbol.draw();
          
          
          }
     }
         