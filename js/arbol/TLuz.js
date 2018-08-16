  /*===================================
=            Clase TLuz            =
===================================*/


class TLuz extends TEntidad{

/**
 *
 * Constructor y metodos de clase
 *
 */
	constructor()
	{
		
    //Para crear la matriz luz necesitamos, la intensidad difusa y especular y la normal
    super();
    
    this.intensidadDifusa = null;
    this.intensidadEspecular = null;
    this.normal = null;

    this.matrix = mat4.create();
    this.matrix = mat4.identity(this.matrix);
 }

 destructor(){
    this.matrix = null;
    this.intensidadDifusa = null;
    this.intensidadEspecular = null; 
 }

  setIntensidadDifusa(v)
  {  
      this.intensidadDifusa =v;
  }
  
  getIntensidadDifusa()
  {
      return this.intensidadDifusa;
  }

  setIntensidadEspecular(v)
  {  
      this.intensidadEspecular =v;
  }

  getIntensidadEspecular()
  {
      return this.intensidadEspecular;
  }

  getNormal()
  {
      return this.normal;
  }

  setNormal(v)
  {
      this.normal = v;
  }

  beginDraw(){

    gl.uniform3fv(shaderProgram.uLightDirection,this.normal);
    gl.uniform4fv(shaderProgram.uLightDiffuse,this.intensidadDifusa); 
    gl.uniform4fv(shaderProgram.uLightSpecular,this.intensidadEspecular);    

    gl.uniform4fv(shaderProgram.uMaterialAmbient, [0.03,0.03,0.03,1.0]);
    gl.uniform4fv(shaderProgram.uMaterialDiffuse, [1.0,1.0,1.0,1.0]);
    gl.uniform4fv(shaderProgram.uMaterialSpecular, [1.0,1.0,1.0,1.0]);
    gl.uniform1f(shaderProgram.uShininess, 230);
  };

  endDraw(){};



}