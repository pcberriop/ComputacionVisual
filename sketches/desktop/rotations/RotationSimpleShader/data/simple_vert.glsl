// las variables uniform se mantienen constantes para cada vertive
// en la escena. Processing emite automaticamente algunas de estas variables
// como la 'transform':
uniform mat4 transform;

// las variables attribute cambian de vertice a vertice. Aca tambien
// Processing emite automaticamente algunas de estas variables, como 
// 'vertex' (tambien llamada 'position') y 'color'. Aunque los atributos
// tambien se pueden personalizar (ver PShape.attrib* aca:
// http://processing.github.io/processing-javadocs/core/processing/core/PShape.html),
// a diferencia de las variables uniform, esto muy raramente se hace.
// Para una descripcion de la convencion de nombres
// de las variables attribute y uniform, referirse a la seccion 'Aliases for
// uniforms and attributes' aca: https://processing.org/tutorials/pshader/
attribute vec4 vertex;
attribute vec4 color;

// esta variable pasa 'interpolada' al fragment shader
varying vec4 vertColor;

void main() {
  // el vertex shader siempre debe computar la posicion final del vertice
  gl_Position = transform * vertex;
  
  // tomamos el color del vertice y lo asociamos a la varying para que la
  // informacion se interpole en el siguiente estadio (fragment shader)
  vertColor = color;
}
