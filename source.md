<section id="themes">
	<h2>Themes</h2>
		<p>
			Set your presentation theme: <br>
			<!-- Hacks to swap themes after the page has loaded. Not flexible and only intended for the reveal.js demo deck. -->
                        <a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/black.css'); return false;">Black (default)</a> -
			<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/white.css'); return false;">White</a> -
			<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/league.css'); return false;">League</a> -
			<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/sky.css'); return false;">Sky</a> -
			<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/beige.css'); return false;">Beige</a> -
			<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/simple.css'); return false;">Simple</a> <br>
			<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/serif.css'); return false;">Serif</a> -
			<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/blood.css'); return false;">Blood</a> -
			<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/night.css'); return false;">Night</a> -
			<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/moon.css'); return false;">Moon</a> -
			<a href="#" onclick="document.getElementById('theme').setAttribute('href','css/theme/solarized.css'); return false;">Solarized</a>
		</p>
</section>

H:

# Kinect

Miguel Bello
Manuel Sambrano
Pedro Berrio

H:

## Index

 1. Intro<!-- .element: class="fragment" data-fragment-index="1"-->
    * Active vs pasive transformations
    * Shaders
 2. Linear transformations<!-- .element: class="fragment" data-fragment-index="2"-->
    * Scaling, rotation & shearing
 3. Affine transformations<!-- .element: class="fragment" data-fragment-index="3"-->
    * Homogeneous space
    * Translation
    * Scaling, rotation & shearing revisited
    * Matrix operations: inversion, composition

V:

## Index (part 2)

 4. Modelling and view<!-- .element: class="fragment" data-fragment-index="4"-->
 5. Projections<!-- .element: class="fragment" data-fragment-index="5"-->
    * Orthographic
    * Perspective
 
H:

## Intro: Active vs pasive transformations

<font color="yellow"> Active Transformation (standard basis) vs Passive Transformation (change of basis)</font>

<img height='300' src='fig/image3.JPG'/>

N:

* Standard = Canonical

V:

## Intro: Shaders

<div class="ulist">
    <img src="fig/pipeline.png" alt="pipeline" width="55%" style="float: right">
    <ul style="width: 30%;">
        <p class="fragment" data-fragment-index="1">Vertex shader</p>
        <p class="fragment" data-fragment-index="2">Fragment shader</p>
    </ul>
</div>

V:

## Intro: Shaders
### Vertex shader: pseudo code

```glsl
for (int i = 0; i < vertexCount; i++) {
  output = vertexShader(vertex[i]);
}

function vertexShader(vertex) {
  projPos = projection * modelview * vertex.position;
  litColor = lightColor * dot(vertex.normal, lightDirection);
  return (projPos, litColor);
}
```

V:

## Intro: Shaders
### Vertex shader

```glsl
uniform mat4 transform;
attribute vec4 vertex;
attribute vec4 color;
varying vec4 vertColor;

void main() {
   gl_Position = transform * vertex;
   vertColor = color;
}
```

V:

## Intro: Shaders
### Vertex shader: glsl code for active *transform*

```glsl
uniform mat4 transform;
attribute vec4 vertex;
attribute vec4 color;
varying vec4 vertColor;

void main() {
   gl_Position = transform * vertex;
   vertColor = color;
}
```

1. `transform = projection`
  
V:

## Intro: Shaders
### Vertex shader: glsl code for passive *transform*

```glsl
uniform mat4 transform;
attribute vec4 vertex;
attribute vec4 color;
varying vec4 vertColor;

void main() {
   gl_Position = transform * vertex;
   vertColor = color;
}
```

1. `transform = projection * modelview`
2. `transform = projection * view * model`

(<a href="#/5/15">goto matrix composition</a> and then to <a href="#/6/12">eye transform</a>)

V:

## Intro: Shaders
### Fragment shader: pseudo code

```glsl
for (int i = 0; i < fragmentCount; i++) {
  screenBuffer[fragment[i].xy] = fragmentShader(fragment[i]);
}

function fragmentShader(fragment) {
  return fragment.litColor;
}
```

V:

## Intro: Shaders
### Fragment shader: glsl code

```glsl
varying vec4 vertColor;

void main() {
  gl_FragColor = vertColor;
}
```

V:

## Intro: Shaders
### GLSL variable types

<li class="fragment"> _uniform_: variables that remain constant for each vertex in the scene. Example: `uniform mat4 transform`
<li class="fragment"> _attribute_: variables that change from vertex to vertex. Examples: `attribute vec4 vertex`, `attribute vec4 color`
<li class="fragment"> _varying_:  variables that are exchanged between the vertex and the fragment shaders. Example: `varying vec4 vertColor`

V:

## Intro: Shaders
### Common GLSL uniform variables emitted by P5

| Name         | Alias              | Type        |
|--------------|--------------------|-------------|
| `transform`  | `transformMatrix`  | `mat4`      |
| `modelview`  | `modelviewMatrix`  | `mat4`      |
| `projection` | `projectionMatrix` | `mat4`      |
| `texture`    | `texMap`           | `sampler2D` |

V:

## Intro: Shaders
### Common GLSL attribute variables emitted by P5

| Name                      | Type   |
|---------------------------|--------|
| `position` (or, `vertex`) | `vec4` |
| `color`                   | `vec4` |
| `normal`                  | `vec3` |

V:

## Intro: Shaders
### Processing shader API: [PShader](https://processing.org/reference/PShader.html)

> Class that encapsulates a GLSL shader program, including a vertex and a fragment shader

V:

## Intro: Shaders
### Processing shader API: [loadShader()](https://processing.org/reference/loadShader_.html)

> Loads a shader into the PShader object

Method signatures

```processing
  loadShader(fragFilename)
  loadShader(fragFilename, vertFilename)
```
<!-- .element: class="fragment" data-fragment-index="1"-->

Example

```processing
  PShader unalShader;
  void setup() {
    ...
    //when no path is specified it looks in the sketch 'data' folder
    unalShader = loadShader("unal_frag.glsl", "unal_vert.glsl");
  }
```
<!-- .element: class="fragment" data-fragment-index="2"-->

V:

## Intro: Shaders
### Processing shader API: [shader()](https://processing.org/reference/shader_.html)

> Applies the specified shader

Method signature

```processing
  shader(shader)
```
<!-- .element: class="fragment" data-fragment-index="1"-->

Example

```processing
  PShader simpleShader, unalShader;
  void draw() {
    ...
    shader(simpleShader);
    simpleGeometry();
    shader(unalShader);
    unalGeometry();
  }
```
<!-- .element: class="fragment" data-fragment-index="2"-->

V:

## Intro: Shaders
### Processing shader API: [resetShader()](https://processing.org/reference/resetShader_.html)

> Restores the default shaders

Method signatures

```processing
  resetShader()
```
<!-- .element: class="fragment" data-fragment-index="1"-->

Example

```processing
    PShader simpleShader;
  void draw() {
    ...
    shader(simpleShader);
    simpleGeometry();
    resetshader();
    otherGeometry();
  }
```
<!-- .element: class="fragment" data-fragment-index="2"-->

V:

## Intro: Shaders
### Processing shader API: [PShader.set()](https://processing.org/reference/PShader_set_.html)

> Sets the uniform variables inside the shader to modify the effect while the program is running

Method signatures for vector uniform variables `vec2`, `vec3` or `vec4`:

```processing
  .set(name, x)
  .set(name, x, y)
  .set(name, x, y, z)
  .set(name, x, y, z, w)
  .set(name, vec)
```

* *name*: of the uniform variable to modify
* *x*, *y*, *z* and *w*: 1st, snd, 3rd and 4rd vec float components resp.
* *vec*: PVector

V:

## Intro: Shaders
### Processing shader API: [PShader.set()](https://processing.org/reference/PShader_set_.html)

> Sets the uniform variables inside the shader to modify the effect while the program is running

Method signatures for vector uniform variables `boolean[]`, `float[]`, `int[]`:

```processing
  .set(name, x)
  .set(name, x, y)
  .set(name, x, y, z)
  .set(name, x, y, z, w)
  .set(name, vec)
```

* *name*: of the uniform variable to modify
* *x*, *y*, *z* and *w*: 1st, snd, 3rd and 4rd vec (boolean, float or int) components resp.
* *vec*: boolean[], float[], int[]

V:

## Intro: Shaders
### Processing shader API: [PShader.set()](https://processing.org/reference/PShader_set_.html)

> Sets the uniform variables inside the shader to modify the effect while the program is running

Method signatures for `mat3` and `mat4` uniform variables:

```processing
  .set(name, mat) // mat is PMatrix2D, or PMatrix3D
```

* *name* of the uniform variable to modify
* *mat* PMatrix3D, or PMatrix2D

V:

## Intro: Shaders
### Processing shader API: [PShader.set()](https://processing.org/reference/PShader_set_.html)

> Sets the uniform variables inside the shader to modify the effect while the program is running

Method signatures for vector uniform variables:

```processing
  .set(name, tex) // tex is a PImage
```

V:

## Intro: Shaders
### Processing shader API: [PShader.set()](https://processing.org/reference/PShader_set_.html)

> Sets the uniform variables inside the shader to modify the effect while the program is running

Example:

```processing
  PShader unalShader;
  PMatrix3D projectionModelView1, projectionModelView2;
  void draw() {
    ...
    shader(unalShader);
    unalShader.set("unalMatrix", projectionModelView1);
    unalGeometry1();
    unalShader.set("unalMatrix", projectionModelView2);
    unalGeometry2();
  }
```
<!-- .element: class="fragment" data-fragment-index="1"-->

H:

## Linear transformations: Notion

Property 1<!-- .element: class="fragment" data-fragment-index="1"-->
   $$F(a+b)= F(a)+ F(b)$$

Property 2<!-- .element: class="fragment" data-fragment-index="2"-->
   $$F(\lambda a) = \lambda F(a)\rightarrow F(0) = 0$$

Observation 1:<!-- .element: class="fragment" data-fragment-index="3"-->
   Matrix multiplication is always linear

Observation 2:<!-- .element: class="fragment" data-fragment-index="4"-->
   Translation is a nonlinear transformation
   
V:

## Linear transformations: 2d scaling

<div class="ulist">
    <img src="fig/image5.JPG" alt="2d scaling" width="38%" style="float: left">
    <ul style="width: 57%;">
        <p class="fragment" data-fragment-index="1">
        `$x'= sx*x$`
        </p>
        <p class="fragment" data-fragment-index="2">
        `$y'= sy*y$`
        </p>
        <p class="fragment" data-fragment-index="3">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        sx & 0 \cr
        0 & sy \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="4">
        $P'= S(sx,sy) \bullet P$
        </p>
    </ul>
</div>

N:

* mirroring and reflections are missed

V:

## Linear transformations: 3d scaling

<div class="ulist">
    <img src="fig/image17.JPG" alt="3d scaling" width="30%" style="float: left">
    <ul style="width: 65%;">
        <p class="fragment" data-fragment-index="1">
        `$x'= sx*x$`
        </p>
        <p class="fragment" data-fragment-index="2">
        `$y'= sy*y$`
        </p>
        <p class="fragment" data-fragment-index="3">
        `$z'= sz*z$`
        </p>
        <p class="fragment" data-fragment-index="4">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        z' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        sx & 0 & 0 \cr
        0 & sy & 0 \cr
        0 & 0 & sz \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        z \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="5">
        $P'= S(sx,sy,sz) \bullet P$
        </p>
    </ul>
</div>

N:

* mirroring and reflections are missed

V:

## Linear transformations: 2d rotation

<div class="ulist">
    <img src="fig/image7.png" alt="2d rotations" width="38%" style="float: left">
    <ul style="width: 57%;">        
        <p class="fragment" data-fragment-index="1">
        $x = rcos \alpha$
        </p>
        <p class="fragment" data-fragment-index="2">
        $y= rsin \alpha$
        </p>
        <p class="fragment" data-fragment-index="3">
        $x'= rcos (\alpha+\beta)$
        $x'= rcos \alpha cos \beta - rsin \alpha sin \beta$
        </p>
        <p class="fragment" data-fragment-index="4">
        $y'= rsin (\alpha+\beta)$
        $y'= rcos \alpha sin \beta - rsin \alpha cos \beta$
        </p>
    </ul>
</div>

V:

## Linear transformations: 2d Rotation

<div class="ulist">
    <img src="fig/image7.png" alt="2d rotations" width="38%" style="float: left">
    <ul style="width: 57%;">        
        <p class="fragment" data-fragment-index="1">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        cos\beta & -sin \beta \cr
        sin\beta & cos \beta \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="2">
        $P'= R(\beta) \bullet P$
        </p>
    </ul>
</div>

V:

## Linear transformations: 3d rotation
### Euler angles (respect to z-axis)

<div class="ulist">
    <img src="fig/image20.JPG" alt="z-axis rotation" width="28%" style="float: left">
    <ul style="width: 67%;">
        <p class="fragment" data-fragment-index="1">
        $z' = z$
        </p>
        <p class="fragment" data-fragment-index="2">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        z' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        cos\beta & -sin \beta & 0 \cr
        sin\beta & cos \beta & 0 \cr
        0 & 0 & 1 \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        z \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="3">
        $P'= R_z(\beta) \bullet P$
        </p>
    </ul>
</div>

V:

## Linear transformations: 3d rotation
### Euler angles (respect to x-axis)

<div class="ulist">
    <img src="fig/image21.JPG" alt="z-axis rotation" width="28%" style="float: left">
    <ul style="width: 67%;">
        <p class="fragment" data-fragment-index="1">
        $x' = x$
        </p>
        <p class="fragment" data-fragment-index="2">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        z' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        1 & 0 & 0 \cr
        0 & cos\beta & -sin \beta \cr
        0 & sin\beta & cos \beta \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        z \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="3">
        $P'= R_x(\beta) \bullet P$
        </p>
    </ul>
</div>

V:

## Linear transformations: 3d rotation
### Euler angles (respect to y-axis)

<div class="ulist">
    <img src="fig/image22.JPG" alt="z-axis rotation" width="28%" style="float: left">
    <ul style="width: 67%;">
        <p class="fragment" data-fragment-index="1">
        $y' = y$
        </p>
        <p class="fragment" data-fragment-index="2">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        z' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        cos\beta & 0 & sin \beta \cr
        0 & 1 & 0 \cr
        -sin\beta & 0 & cos \beta \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        z \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="3">
        $P'= R_y(\beta) \bullet P$
        </p>
    </ul>
</div>

V:

## Linear transformations: 2d shearing

<div class="ulist">
    <img src="fig/shearing2d.png" alt="2d shearing" width="38%" style="float: left">
    <ul style="width: 57%;">
        <p class="fragment" data-fragment-index="1">
        `$x'= x + h*y$`
        </p>
        <p class="fragment" data-fragment-index="2">
        `$y'=y$`
        </p>
        <p class="fragment" data-fragment-index="3">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        1 & h \cr
        0 & 1 \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="4">
        $P'= D_x(h) \bullet P$
        </p>
    </ul>
</div>

V:

## Linear transformations: 2d shearing

<div class="ulist">
    <img src="fig/shearing2dy.png" alt="2d y-shearing" width="38%" style="float: left">
    <ul style="width: 57%;">
        <p class="fragment" data-fragment-index="1">
        `$x'= x$`
        </p>
        <p class="fragment" data-fragment-index="2">
        `$y'=y + h*x$`
        </p>
        <p class="fragment" data-fragment-index="3">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        1 & 0 \cr
        h & 1 \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="4">
        $P'= D_y(h) \bullet P$
        </p>
    </ul>
</div>

V:

## Linear transformations: 3d shearing

<div class="ulist">
    <img src="fig/shearing_proscene.png" alt="3d shearing" width="38%" style="float: left">
    <ul style="width: 57%;">
        <p class="fragment" data-fragment-index="1">
        `$x'=x+az$`
        </p>
        <p class="fragment" data-fragment-index="2">
        `$y'=y+bz$`
        </p>
        <p class="fragment" data-fragment-index="3">
        `$z'=z$`
        </p>
        <p class="fragment" data-fragment-index="4">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        z' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        1 & 0 & a \cr
        0 & 1 & b \cr
        0 & 0 & 1 \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        z \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="5">
        $P'= D_z(a,b) \bullet P$ (<a href="#/5/4">goto 2d translation</a>)
        </p>
    </ul>
</div>

V:

## Linear transformations: 3d shearing

...don't forget $P'= D_x(a,b) \bullet P$ and $P'= D_y(a,b) \bullet P$

H:

## Affine transformations
### Non-linearity of translation

<div class="ulist">
    <img src="fig/image4.JPG" alt="2d translation" width="38%" style="float: left">
    <ul style="width: 57%;">
        <p class="fragment" data-fragment-index="1">
        `$x'= x + dx$`
        </p>
        <p class="fragment" data-fragment-index="2">
        `$y'=y + dy$`
        </p>
        <p class="fragment" data-fragment-index="3">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        dx \cr
        dy \cr
        \end{bmatrix} + \begin{bmatrix} 
        x \cr 
        y \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="4">
        $P'= T(dx,dy) + P$
        </p>
    </ul>
</div>

V:

## Affine transformations: Notion

<p align ="center">
Linear transformations $+$ Translation $\rightarrow P' = M\ast P + T $
</p>

V:

## Affine transformations: Homogeneous space $\rightarrow$ 2d

<div class="ulist">
    <img src="fig/image9.JPG" alt="Homogeneous space" width="38%" style="float: left">
    <ul style="width: 57%;">
        <p class="fragment" data-fragment-index="1">
        Homogeneous w-coordinate: $(x,y,w)$
        </p>
        <p class="fragment" data-fragment-index="2">
        Homogeneous space $\rightarrow$ 2d
        </p>
        <p class="fragment" data-fragment-index="3">
        $(x,y,1) \rightarrow (x,y)$, for $w=1$
        </p>
        <p class="fragment" data-fragment-index="4">
        In general: $(x,y,w) \rightarrow (x/w,y/w)$
        </p>
    </ul>
</div>

V:

## Affine transformations: Homogeneous space $\rightarrow$ 3d

<p class="fragment" data-fragment-index="1">
$(x,y,z,1) \rightarrow (x,y,z)$, for $w=1$
</p>
<p class="fragment" data-fragment-index="2">
In general: $(x,y,z,w) \rightarrow (x/w,y/w,z/w)$
</p>

V:

## Affine transformations: Translation

<div class="ulist">
    <img src="fig/image4.JPG" alt="2d translation" width="38%" style="float: left">
    <ul style="width: 57%;">
        <p class="fragment" data-fragment-index="1">
        `$x'= x + dx$`
        </p>
        <p class="fragment" data-fragment-index="2">
        `$y'=y + dy$`
        </p>
        <p class="fragment" data-fragment-index="3">
        `$w'=w=1$`
        </p>
        <p class="fragment" data-fragment-index="4">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        w' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        1 & 0 & dx \cr
        0 & 1 & dy \cr
        0 & 0 & 1 \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        w \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="5">
        $P'= T(dx,dy) \bullet P$ (<a href="#/4/10">goto 3d shearing</a>)
        </p>
    </ul>
</div>

V:

## Affine transformations: Translation

<div class="ulist">
    <img src="fig/image15.JPG" alt="3d translation" width="38%" style="float: left">
    <ul style="width: 57%;">
        <p class="fragment" data-fragment-index="1">
        `$x'= x + dx$`
        </p>
        <p class="fragment" data-fragment-index="2">
        `$y'=y + dy$`
        </p>
        <p class="fragment" data-fragment-index="3">
        `$z'=z + dz$`
        </p>
        <p class="fragment" data-fragment-index="4">
        `$w'=w=1$`
        </p>
        <p class="fragment" data-fragment-index="5">
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        z' \cr
        w' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        1 & 0 & 0 & dx \cr
        0 & 1 & 0 & dy \cr
        0 & 0 & 1 & dz \cr
        0 & 0 & 0 & 1 \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        z \cr
        w \cr
        \end{bmatrix}
        $`
        </p>
        <p class="fragment" data-fragment-index="6">
        $P'= T(dx,dy,dz) \bullet P$
        </p>
    </ul>
</div>

V:

## Affine transformations: Shearing (r)

<div class="ulist">
    <img src="fig/shearing_proscene.png" alt="3d shearing" width="38%" style="float: left">
    <ul style="width: 57%;">
        <p>
        `$x'=x+az$`
        </p>
        <p>
        `$y'=y+bz$`
        </p>
        <p>
        `$z'=z$`
        </p>
        <p>
        `$w'=w=1$`
        </p>
        <p>
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        z' \cr
        w' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        1 & 0 & a & 0 \cr
        0 & 1 & b & 0 \cr
        0 & 0 & 1 & 0 \cr
        0 & 0 & 0 & 1 \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        z \cr
        w \cr
        \end{bmatrix}
        $`
        </p>
        <p>
        $P'= D_z(a,b) \bullet P$
        </p>
    </ul>
</div>

V:

## Affine transformations: Scaling (r)

<div class="ulist">
    <img src="fig/image17.JPG" alt="3d scaling" width="30%" style="float: left">
    <ul style="width: 65%;">
        <p>
        `$x'= sx*x$`
        </p>
        <p>
        `$y'= sy*y$`
        </p>
        <p>
        `$z'= sz*z$`
        </p>
        <p>
        `$w'=w=1$`
        </p>
        <p>
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        z' \cr
        w' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        sx & 0 & 0 & 0 \cr
        0 & sy & 0 & 0 \cr
        0 & 0 & sz & 0 \cr
        0 & 0 & 0 & 1 \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        z \cr
        w \cr
        \end{bmatrix}
        $`
        </p>
        <p>
        $P'= S(sx,sy,sz) \bullet P$
        </p>
    </ul>
</div>


V:

## Affine transformations: 3d rotation (r)
### Euler angles (respect to z-axis)

<div class="ulist">
    <img src="fig/image20.JPG" alt="z-axis rotation" width="28%" style="float: left">
    <ul style="width: 67%;">
        <p>
        $z' = z$
        </p>
        <p>
        `$w'=w=1$`
        </p>
        <p>
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        z' \cr
        w' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        cos\beta & -sin \beta & 0 & 0 \cr
        sin\beta & cos \beta & 0 & 0 \cr
        0 & 0 & 1 & 0 \cr
        0 & 0 & 0 & 1 \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        z \cr
        w \cr
        \end{bmatrix}
        $`
        </p>
        <p>
        $P'= R_z(\beta) \bullet P$
        </p>
    </ul>
</div>

V:

## Affine transformations: 3d rotation (r)
### Euler angles (respect to x-axis)

<div class="ulist">
    <img src="fig/image21.JPG" alt="z-axis rotation" width="28%" style="float: left">
    <ul style="width: 67%;">
        <p>
        $x' = x$
        </p>
        <p>
        `$w'=w=1$`
        </p>
        <p>
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        z' \cr
        w' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        1 & 0 & 0 & 0 \cr
        0 & cos\beta & -sin \beta & 0 \cr
        0 & sin\beta & cos \beta & 0 \cr
        0 & 0 & 0 & 1 \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        z \cr
        w \cr
        \end{bmatrix}
        $`
        </p>
        <p>
        $P'= R_x(\beta) \bullet P$
        </p>
    </ul>
</div>

V:

## Affine transformations: 3d rotation (r)
### Euler angles (respect to y-axis)

<div class="ulist">
    <img src="fig/image22.JPG" alt="z-axis rotation" width="28%" style="float: left">
    <ul style="width: 67%;">
        <p>
        $y' = y$
        </p>
        <p>
        `$w'=w=1$`
        </p>
        <p>
        `$\begin{bmatrix} 
        x' \cr 
        y' \cr
        z' \cr
        w' \cr
        \end{bmatrix}
        = 
        \begin{bmatrix}
        cos\beta & 0 & sin \beta & 0 \cr
        0 & 1 & 0 & 0 \cr
        -sin\beta & 0 & cos \beta & 0 \cr
        0 & 0 & 0 & 1 \cr
        \end{bmatrix} \bullet \begin{bmatrix} 
        x \cr 
        y \cr
        z \cr
        w \cr
        \end{bmatrix}
        $`
        </p>
        <p>
        $P'= R_y(\beta) \bullet P$
        </p>
    </ul>
</div>

V:

## Affine transformations: Rotation
### Orthogonal matrix

V:

## Affine transformations: Rotation
### [Rodrigues' rotation formula](https://en.wikipedia.org/wiki/Rodrigues'_rotation_formula)

V:

## Affine transformations: Rotation
### Euler angles Rodrigues' rotation relationship

N:

thinking it'd make a lot more of sense to simply go:
* Affine transformations: ...
* Affine transformations: Rotation: Orthogonal matrix
* Affine transformations: Rotation: Rodrigues
* Affine transformations: Rotation: Euler angles
* Affine transformations: Rotation: Euler angles Rodrigues' rotation relationship
* Affine transformations: Rotation: Quaternions magic

from next semester onwards :-P

V:

## Affine transformations: Rotation
### Quaternions

V:

## Affine transformations: Matrix operations
### Inversion

Let $M$ be an affine transformation matrix such that:

$$P'=MP$$

<!-- .element: class="fragment" data-fragment-index="1"-->

Let $M^{-1}$ be the inverse of $M$. Observe that:

<!-- .element: class="fragment" data-fragment-index="2"-->

$$M^{-1}P'=M^{-1}MP=(M^{-1}M)P=IP=P$$

<!-- .element: class="fragment" data-fragment-index="3"-->

V:

## Affine transformations: Matrix operations
### Affine inverse matrices

| Transformation |    Direct     |      Inverted       |
|----------------|---------------|---------------------|
| Translation    | $T(dx,dy,dz)$ |   $T(-dx,-dy,-dz)$  |
| Shearing       |   $D_z(a,b)$  |     $D_z(-a,-b)$    |
| Scaling        | $S(sx,sy,sz)$ | $S(1/sx,1/sy,1/sz)$ |
| Rotation       |  $R_z(\beta)$ |    $R_z(-\beta)$    |

V:

## Affine transformations: Matrix operations
### Composition

Consider the following sequence of transformations:

`$P_1=M_1P,$` <!-- .element: class="fragment" data-fragment-index="1"-->
`$P_2=M_2P_1,$` <!-- .element: class="fragment" data-fragment-index="2"-->
`$...,$` <!-- .element: class="fragment" data-fragment-index="3"-->
`$P_n=M_nP_{n-1}$` <!-- .element: class="fragment" data-fragment-index="4"-->

which is the same as: <!-- .element: class="fragment" data-fragment-index="5"-->
`$P_n=M_n^*P$, where $M_n^*=M_n...M_2M_1$` <!-- .element: class="fragment" data-fragment-index="6"-->

<a href="#/3/5">goto vertex shader</a><!-- .element: class="fragment" data-fragment-index="7"-->

Mnemonic 1:<!-- .element: class="fragment" data-fragment-index="8"-->
   The (right-to-left) $M_1M_2...M_n$ transformation sequence is performed respect to a world (fixed) coordinate system

Mnemonic 2:<!-- .element: class="fragment" data-fragment-index="9"-->
   The (left-to-right) $M_n,...M_2M_1$ transformation sequence is performed respect to a local (mutable) coordinate system
   
V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples

<figure>
    <img height="400" src="fig/image10.JPG">
    <figcaption>Rotation respect to pivot $(x_r,y_r)$, angle = $\beta$</figcaption>
</figure>

V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples

<figure>
    <img height="400" src="fig/image11.png">
    <figcaption>$T(x_r,y_r)R_z(\beta)T(-x_r,-y_r)P$</figcaption>
</figure>

V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples
$T(x_r,y_r)R_z(\beta)T(-x_r,-y_r)$ Processing implementation

<div id='rotation_id'></div>

V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples
$T(x_r,y_r)R_z(\beta)T(-x_r,-y_r)$ Processing implementation: [default shader](https://github.com/VisualComputing/Transformations/blob/gh-pages/sketches/desktop/rotations/RotationDefaultShader/RotationDefaultShader.pde) (`applyMatrix()`)

```processing
float xr=500, yr=250;
float beta = -QUARTER_PI;

void draw() {
  background(0);
  // We do the rotation as: T(xr,yr)Rz(β)T(−xr,−yr)
  // 1. T(xr,yr)
  applyMatrix(1, 0, 0, xr, 
              0, 1, 0, yr, 
              0, 0, 1, 0, 
              0, 0, 0, 1);
  // 2. Rz(β)
  applyMatrix(cos(beta), -sin(beta), 0, 0, 
              sin(beta), cos(beta),  0, 0, 
              0,         0,          1, 0, 
              0,         0,          0, 1);
  // 3. T(−xr,−yr)
  applyMatrix(1, 0, 0, -xr, 
              0, 1, 0, -yr, 
              0, 0, 1, 0, 
              0, 0, 0, 1);
  // drawing code follows
} 
```

V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples
$T(x_r,y_r)R_z(\beta)T(-x_r,-y_r)$ Processing implementation: [default shader](https://github.com/VisualComputing/Transformations/blob/gh-pages/sketches/desktop/rotations/RotationDefaultShader/RotationDefaultShader.pde) (`translation()` and `rotation()`)

```processing
float xr=500, yr=250;
float beta = -QUARTER_PI;

void draw() {
  background(0);
  // 1. T(xr,yr)
  translate(xr, yr);
  // 2. Rz(β)
  rotate(beta);
  // 3. T(−xr,−yr)
  translate(-xr, -yr);
  // drawing code follows
} 
```

Hence `translate()`, `rotate()`, applies the transformation to the current `modelview`

V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples
$T(x_r,y_r)R_z(\beta)T(-x_r,-y_r)$ Processing implementation: [simple shader](https://github.com/VisualComputing/Transformations/tree/gh-pages/sketches/desktop/rotations/RotationSimpleShader)

```processing
PShader simpleShader;

void setup() {
  size(700, 700, P3D);
  // simple custom shader
  simpleShader = loadShader("simple_frag.glsl", "simple_vert.glsl");
  shader(simpleShader);
} 
```

V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples
$T(x_r,y_r)R_z(\beta)T(-x_r,-y_r)$ Processing implementation: [simple shader](https://github.com/VisualComputing/Transformations/tree/gh-pages/sketches/desktop/rotations/RotationSimpleShader)

[simple_vert.glsl](https://github.com/VisualComputing/Transformations/blob/gh-pages/sketches/desktop/rotations/RotationSimpleShader/data/simple_vert.glsl):

```glsl
uniform mat4 transform;
attribute vec4 vertex;
attribute vec4 color;
varying vec4 vertColor;

void main() {
  gl_Position = transform * vertex;
  vertColor = color;
}
```

Since here we use the default uniforms (`transform`) and attributes (`vertex`, `color`) the rest of the sketch remains the same

V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples
$T(x_r,y_r)R_z(\beta)T(-x_r,-y_r)$ Processing implementation: [unal shader](https://github.com/VisualComputing/Transformations/tree/gh-pages/sketches/desktop/rotations/RotationUnalShader)

```processing
PShader unalShader;
PMatrix3D modelview;

void setup() {
  size(700, 700, P3D);
  // unal custom shader
  unalShader = loadShader("unal_frag.glsl", "unal_vert.glsl");
  shader(unalShader);
  modelview = new PMatrix3D();
} 
```

V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples
$T(x_r,y_r)R_z(\beta)T(-x_r,-y_r)$ Processing implementation: [unal shader](https://github.com/VisualComputing/Transformations/tree/gh-pages/sketches/desktop/rotations/RotationUnalShader)

```processing
void draw() {
  background(0);
  //load identity
  modelview.reset();
  // 1. T(xr,yr)
  modelview.translate(xr, yr);
  // 2. Rz(β)
  modelview.rotate(beta);
  // 1. T(-xr,-yr)
  modelview.translate(-xr, -yr);
  emitUniforms();
  // drawing code follows
}
```

```processing
void emitUniforms() {
  //hack to retrieve the Processing projection matrix
  PMatrix3D projectionTimesModelview = new PMatrix3D(((PGraphics2D)g).projection);
  projectionTimesModelview.apply(modelview);
  //GLSL uses column major order, whereas processing uses row major order
  projectionTimesModelview.transpose();
  unalShader.set("unalMatrix", projectionTimesModelview);
}
```
<!-- .element: class="fragment" data-fragment-index="1"-->

V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples
$T(x_r,y_r)R_z(\beta)T(-x_r,-y_r)$ Processing implementation: [unal shader](https://github.com/VisualComputing/Transformations/tree/gh-pages/sketches/desktop/rotations/RotationUnalShader)

[unal_vert.glsl](https://github.com/VisualComputing/Transformations/blob/gh-pages/sketches/desktop/rotations/RotationUnalShader/data/unal_vert.glsl):

```glsl
uniform mat4 unalMatrix;
attribute vec4 vertex;
attribute vec4 color;
varying vec4 unalVertColor;

void main() {
  gl_Position = unalMatrix * vertex;
  unalVertColor = color;
}
```

<li class="fragment"> Note the use of the custom uniform `unalMatrix` instead of the default `transform`
<li class="fragment"> The [Shader Programming for Computational Arts and Design](http://www.scitepress.org/DigitalLibrary/PublicationsDetail.aspx?ID=ysaclbloDHk=&t=1) paper discusses API _simplicity_ and _flexibility_ in shader programming

V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples

<figure>
    <img height="400" src="fig/image12.JPG">
    <figcaption>Scaling respect to reference point $(x_f,y_f)$</figcaption>
</figure>

V:

## Affine transformations: Matrix operations
### Mnemonic 1 examples

<figure>
    <img height="400" src="fig/image13.JPG">
    <figcaption>$T(x_f,y_f)S(sx,sy)T(-x_f,-y_f)P$</figcaption>
</figure>

H:

## Modelling and view: Frame notion

> Mnemonic 2: The (left-to-right) $M_n,...M_2M_1$ transformation sequence is performed respect to a local (mutable) coordinate system

Local coordinate systems are commonly referred to as "frames" <!-- .element: class="fragment" data-fragment-index="1"-->

V:

## Modelling and view: Frame notion

Consider the function `axes()` which draws the X (horizontal) and Y vertical) axes:

```processing
void axes() {
  pushStyle();
  // X-Axis
  strokeWeight(4);
  stroke(255, 0, 0);
  fill(255, 0, 0);
  line(0, 0, 100, 0);//horizontal red X-axis line
  text("X", 100 + 5, 0);
  // Y-Axis
  stroke(0, 0, 255);
  fill(0, 0, 255);
  line(0, 0, 0, 100);//vertical blue Y-axis line
  text("Y", 0, 100 + 15);
  popStyle();
}
```

V:

## Modelling and view: Frame notion

let's first call the `axes()` function to see what it does:

```processing
void draw() {
  background(50);
  axes();
}
```

<div id='frames1_id'></div>
<!-- .element: class="fragment" data-fragment-index="1"-->

V:

## Modelling and view: Frame notion

now let's call it again, but pre-translating it first:

```processing
void draw() {
  background(50);
  axes();
  translate(300, 180);//translation
  axes();//2nd call
}
```

<div id='frames2_id'></div>
<!-- .element: class="fragment" data-fragment-index="1"-->

V:

## Modelling and view: Frame notion

let's add a rotation to the second `axes()` call:

```processing
void draw() {
  background(50);
  axes();
  translate(300, 180);
  rotate(QUARTER_PI / 2);//rotation after translation
  axes();//2nd call
}
```

<div id='frames3_id'></div>
<!-- .element: class="fragment" data-fragment-index="1"-->

V:

## Modelling and view: Frame notion

let's do something similar with a third `axes()` call:

```processing
void draw() {
  background(50);
  axes();
  translate(300, 180);
  rotate(QUARTER_PI/2);
  axes();
  translate(260, -180);
  rotate(-QUARTER_PI);
  scale(1.5);//even scaling it
  axes();//3rd call
}
```

<div id='frames4_id'></div>
<!-- .element: class="fragment" data-fragment-index="1"-->

V:

## Modelling and view: Frame notion

see the result when we animate only the _first_ rotation;

```processing
void draw() {
  background(50);
  axes();
  translate(300, 180);
  rotate(QUARTER_PI/2 * p.frameCount);//animation line
  axes();
  translate(260, -180);
  rotate(-QUARTER_PI);
  scale(1.5);
  axes();
}
```

<div id='frames5_id'></div>
<!-- .element: class="fragment" data-fragment-index="1"-->

V:

## Modelling and view: Frame notion

and now see the result when we animate only the _second_ rotation;

```processing
void draw() {
  background(50);
  axes();
  translate(300, 180);
  rotate(QUARTER_PI/2);
  axes();
  translate(260, -180);
  rotate(-QUARTER_PI * p.frameCount);//animation line
  scale(1.5);
  axes();
}
```

<div id='frames6_id'></div>
<!-- .element: class="fragment" data-fragment-index="1"-->

V:

## Modelling and view: Frame notion

> A frame is defined by an affine (composed) transform: `$M_i^*, 1 \leq i \leq 3$`
read in left-to-right order (<a href="#/5/16">goto mnemonic 2</a>)

V:

## Modelling and view: [Scene-graph](https://github.com/VisualComputing/Transformations/blob/gh-pages/sketches/desktop/scenegraph/SceneGraph/SceneGraph.pde)

> A scene-graph is a [directed acyclic graph (DAG)](https://en.wikipedia.org/wiki/Directed_acyclic_graph) of frames which root is the world coordinate system

V:

## Modelling and view: [Scene-graph](https://github.com/VisualComputing/Transformations/blob/gh-pages/sketches/desktop/scenegraph/SceneGraph/SceneGraph.pde)
### Eyeless example

```processing
 World
  ^
  |
 L1
  ^
  |\
 L2  L3
```

```processing
void drawModel() {
  // define a local frame L1 (respect to the world)
  pushMatrix();
  affineTransform1();
  drawL1();
  // define a local frame L2 respect to L1
  pushMatrix();
  affineTransform2();
  drawL2();
  // "return" to L1
  popMatrix();
  // define a local coordinate system L3 respect to L1
  pushMatrix();
  affineTransform3();
  drawL3();
  // return to L1
  popMatrix();
  // return to World
  popMatrix();
}
```
<!-- .element: class="fragment" data-fragment-index="1"-->

V:

## Modelling and view: [Scene-graph](https://github.com/VisualComputing/Transformations/blob/gh-pages/sketches/desktop/scenegraph/SceneGraph/SceneGraph.pde)
### Eyeless example

<div id='scene-graph_id'></div>

V:

## Modelling and view: [Scene-graph](https://github.com/VisualComputing/Transformations/blob/gh-pages/sketches/desktop/scenegraph/SceneGraph/SceneGraph.pde)
### View transform (eye-frame)

```processing
 World
  ^
  |\
... Eye
  ^
  |\
... ...
```

Let the eye frame transform be defined, like it is with any other frame, as:<!-- .element: class="fragment" data-fragment-index="1"-->
`$M_{eye}^*$`<!-- .element: class="fragment" data-fragment-index="2"-->

The eye transform is therefore:<!-- .element: class="fragment" data-fragment-index="3"-->
`$\left.M_{eye}^{*}\right.^{-1}$`<!-- .element: class="fragment" data-fragment-index="4"-->
<a href="#/3/5">(goto vertex shader)</a><!-- .element: class="fragment" data-fragment-index="4"-->

For example, for an eye frame transform:<!-- .element: class="fragment" data-fragment-index="5"-->
`$M_{eye}^*=T(x,y,z)R(\beta)S(s)$`<!-- .element: class="fragment" data-fragment-index="6"-->

The eye transform would be:<!-- .element: class="fragment" data-fragment-index="7"-->
`$\left.M_{eye}^{*}\right.^{-1}=S(1/s)R(-\beta)T(-x,-y,-z)$`<!-- .element: class="fragment" data-fragment-index="8"-->

N:

`$M_{eye}^*$` would position (orient, scale, ...) the eye frame
in the world, but want it to be the other way around (i.e., draw the scene from the eye point-of-view)

V:

## Modelling and view: Scene-graph
### [View](https://github.com/VisualComputing/Transformations/blob/gh-pages/sketches/desktop/scenegraph/MiniMap/MiniMap.pde) example

```processing
 World
  ^
  |\
 L1 Eye
  ^
  |\
 L2  L3
```

```processing
void draw() {
  // the following sequence would position (orient, scale, ...) the eye frame in the world:
  // translate(eyePosition.x, eyePosition.y);
  // rotate(eyeOrientation);
  // scale(eyeScaling)
  // drawEye();
  scale(1/eyeScaling);
  rotate(-eyeOrientation);
  translate(-eyePosition.x, -eyePosition.y);
  drawModel();
}
```
<!-- .element: class="fragment" data-fragment-index="1"-->

V:

## Modelling and view: Scene-graph
### [View](https://github.com/VisualComputing/Transformations/blob/gh-pages/sketches/desktop/scenegraph/MiniMap/MiniMap.pde) example

<div id='minimap_id'></div>

H:

## Projections: Orthographic
### View volume: Eye and Clip spaces

<figure>
    <img height='400' src='fig/pimage6.png' />
    <figcaption>[Orthographic Volume and Normalized Device Coordinates (NDC)](http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho)</figcaption>
</figure>

Let $P_e$ be a point in *eye* space and $P_c$ a point in clip space, we seek:

$$P_e = [x_e,y_e,z_e]\xrightarrow{\text{map}}P_c = [x_c,y_c,z_c]$$<!-- .element: class="fragment" data-fragment-index="1"-->

$$x_e \in [l,r] \rightarrow x_c \in [-1,1], y_e \in [b,t] \rightarrow y_c \in [-1,1], z_e \in [n,f] \rightarrow z_c \in [-1,1]$$<!-- .element: class="fragment" data-fragment-index="2"-->

V:

## Projections: Orthographic
### View volume: [Re-mapping a variable among ranges (general case)](http://stackoverflow.com/questions/929103/convert-a-number-range-to-another-range-maintaining-ratio)

                |---------------*---------|          ->           |-------------------*--------------|
               min              u        max                     min'                 u'            max'
    
The linear conversion is given by:

`$$u' = min'+(u-min)(\Delta u')/(\Delta u)$$`

where `$\Delta u=max-min$`, and `$\Delta u'=max'-min'$`

which may be re-written as:<!-- .element: class="fragment" data-fragment-index="1"-->

`$$u' = uS_u + T_u$$`<!-- .element: class="fragment" data-fragment-index="2"-->
`$$S_u=\Delta u'/\Delta u$$`<!-- .element: class="fragment" data-fragment-index="3"-->
`$$T_u=(min'\Delta u - min\Delta u')/\Delta u$$`<!-- .element: class="fragment" data-fragment-index="4"-->

V:

## Projections: Orthographic
### View volume: Re-mapping a variable among ranges (our case)

                |---------------*---------|          ->           |-------------------*--------------|
               min              u        max                     -1                   u'             1

`$$u' = uS_u + T_u$$`
`$$S_u=2/(max-min)$$`
`$$T_u=-(max+min)/(max-min)$$`

V:

## Projections: Orthographic
### Matrix form: formulation

<blockquote>
`$$u' = uS_u + T_u$$`
</blockquote>

<p class="fragment" data-fragment-index="1">
$$[x_e,y_e,z_e]\xrightarrow{\text{map}}[x_c,y_c,z_c]$$
$$x_e \in [l,r] \rightarrow x_c \in [-1,1], y_e \in [b,t] \rightarrow y_c \in [-1,1], z_e \in [n,f] \rightarrow z_c \in [-1,1]$$
</p>
        
<p class="fragment" data-fragment-index="2">
`$\begin{bmatrix} 
x_c \cr 
y_c \cr
z_c \cr
w_c \cr
\end{bmatrix}
= 
\begin{bmatrix}
S_{x_e} & 0       & 0       & T_{x_e} \cr
0       & S_{y_e} & 0       & T_{y_e} \cr
0       & 0       & S_{z_e} & T_{z_e} \cr
0       & 0       & 0       & 1  \cr
\end{bmatrix} \bullet \begin{bmatrix} 
x_e \cr 
y_e \cr
z_e \cr
w_e(=1) \cr
\end{bmatrix}
$`
</p>
<p class="fragment" data-fragment-index="3">
`$P_c = Ortho(S_{x_e/y_e/z_e},T_{x_e/y_e/z_e}) \bullet P_e$`
</p>

V:

## Projections: Orthographic
### Matrix form: solution

<blockquote>
`$$u' = uS_u + T_u$$`
`$$S_u=2/(max-min)$$`
`$$T_u=-(max+min)/(max-min)$$`
</blockquote>

<p class="fragment" data-fragment-index="1">
$$[x_e,y_e,z_e]\xrightarrow{\text{map}}[x_c,y_c,z_c]$$
$$x_e \in [l,r] \rightarrow x_c \in [-1,1], y_e \in [b,t] \rightarrow y_c \in [-1,1], z_e \in [n,f] \rightarrow z_c \in [-1,1]$$
</p>
        
<p class="fragment" data-fragment-index="2">
`$\begin{bmatrix} 
x_c \cr 
y_c \cr
z_c \cr
w_c \cr
\end{bmatrix}
= 
\begin{bmatrix}
2 \above 1pt (r-l) & 0                    & 0                   & -(r+l) \above 1pt (r-l) \cr
0                  & 2 \above 1pt (t-b) & 0                     & -(t+b) \above 1pt (t-b) \cr
0                  & 0                    & -2 \above 1pt (f-n) & -(f+n) \above 1pt (f-n) \cr
0                  & 0                    & 0                   & 1  \cr
\end{bmatrix} \bullet \begin{bmatrix} 
x_e \cr 
y_e \cr
z_e \cr
w_e(=1) \cr
\end{bmatrix}
$`
</p>
<p class="fragment" data-fragment-index="3">
`$P_c = Ortho(l,r,b,t,n,f) \bullet P_e$`
</p>

V:

## Projections: Orthographic
### Matrix form: Symmetrical viewing volume (`$l=-r$` and `$b=-t$`)

<blockquote>
`$$u' = uS_u + T_u$$`
`$$S_u=2/(max-min)$$`
`$$T_u=-(max+min)/(max-min)$$`
</blockquote>

$$[x_e,y_e,z_e]\xrightarrow{\text{map}}[x_c,y_c,z_c]$$
$$x_e \in [-r,r] \rightarrow x_c \in [-1,1], y_e \in [-t,t] \rightarrow y_c \in [-1,1], z_e \in [n,f] \rightarrow z_c \in [-1,1]$$
        
`$\begin{bmatrix} 
x_c \cr 
y_c \cr
z_c \cr
w_c \cr
\end{bmatrix}
= 
\begin{bmatrix}
1 \above 1pt r & 0                    & 0                   & 0 \cr
0              & 1 \above 1pt t       & 0                   & 0 \cr
0              & 0                    & -2 \above 1pt (f-n) & -(f+n) \above 1pt (f-n) \cr
0              & 0                    & 0                   & 1  \cr
\end{bmatrix} \bullet \begin{bmatrix} 
x_e \cr 
y_e \cr
z_e \cr
w_e(=1) \cr
\end{bmatrix}
$`
</p>
<p class="fragment" data-fragment-index="2">
`$P_c= Ortho(r,t,n,f) \bullet P_e$`
</p>

V:

## Projections: Perspective
### View volume

<figure>
    <img height='400' src='fig/perspvolume.png' />
    <figcaption>[Perspective Frustum and Normalized Device Coordinates (NDC)](http://www.songho.ca/opengl/gl_projectionmatrix.html#perspective)</figcaption>
</figure>

Let $P_e$ be a point in *eye* space and $P_n$ a point in NDC, we seek:

$$P_e = [x_e,y_e,z_e,w_e(=1)]\xrightarrow{\text{map}}P_c = [x_c,y_c,z_c,w_c(\neq 1)]$$<!-- .element: class="fragment" data-fragment-index="1"-->

$$P_c = [x_c,y_c,z_c,w_c(\neq 1)]\xrightarrow[\text{divide}]{\text{perspective}}P_n = [x_n(=x_c/w_c),y_n(=y_c/w_c),z_n(=z_c/w_c),1]$$<!-- .element: class="fragment" data-fragment-index="2"-->

V:

## Projections: Perspective
### Near plane projection of `$x_e,y_e \xrightarrow {\text{onto}} x_p,y_p$`

<figure>
    <img height='400' src='fig/proj_x.png' />
    <figcaption>Top view of frustum</figcaption>
</figure>

`$${x_p\above 1pt x_e}= {-n\above 1pt z_e}$$`
`$$x_p= {nx_e\above 1pt -z_e}$$`<!-- .element: class="fragment" data-fragment-index="2"-->

V:

## Projections: Perspective
### Near plane projection of `$x_e,y_e \xrightarrow {\text{onto}} x_p,y_p$`

<figure>
    <img height='400' src='fig/proj_y.png' />
    <figcaption>Side view of frustum</figcaption>
</figure>

`$${y_p\above 1pt y_e}= {-n\above 1pt z_e}$$`
`$$y_p= {ny_e\above 1pt -z_e}$$`<!-- .element: class="fragment" data-fragment-index="2"-->

V:

## Projections: Perspective
### Near plane projection of `$x_e,y_e \xrightarrow {\text{onto}} x_p,y_p$`

<blockquote>
`$$x_p= {nx_e\above 1pt -z_e},y_p= {ny_e\above 1pt -z_e}$$`
</blockquote>

which means<!-- .element: class="fragment" data-fragment-index="1"--> `${\color{red} {w_c}}=-z_e$`<!-- .element: class="fragment" data-fragment-index="1"-->

`$$\begin{bmatrix} 
x_c \cr 
y_c \cr
z_c \cr
w_c \cr
\end{bmatrix}
= 
\begin{bmatrix}
. & . & .  & . \cr
. & . & .  & . \cr
. & . & .  & . \cr
0 & 0 & {\color{red} {-1}} & 0 \cr
\end{bmatrix} \bullet \begin{bmatrix} 
x_e \cr 
y_e \cr
z_e \cr
w_e(=1) \cr
\end{bmatrix}
$$`
<!-- .element: class="fragment" data-fragment-index="2"-->

V:

## Projections: Perspective
### `$x_e$,$y_e$` coordinate mapping (using our ortho matrix)

<blockquote>
`$${\color{green} {x_p}}= {nx_e\above 1pt -z_e},{\color{green} {y_p}}= {ny_e\above 1pt -z_e},w_c=-z_e$$`
</blockquote>

`$$\begin{bmatrix} 
{\color{blue} {x_n}} \cr 
{\color{blue} {y_n}} \cr
z_c \cr
w_c \cr
\end{bmatrix}
= 
\begin{bmatrix}
2 \above 1pt (r-l) & 0                  & 0 & -(r+l) \above 1pt (r-l) \cr
0                  & 2 \above 1pt (t-b) & 0 & -(t+b) \above 1pt (t-b) \cr
. & . & .  & . \cr
. & . & .  & . \cr
\end{bmatrix} \bullet \begin{bmatrix} 
{\color{green} {x_p}} \cr 
{\color{green} {y_p}} \cr
z_e \cr
w_e(=1) \cr
\end{bmatrix}
$$`

solving for <!-- .element: class="fragment" data-fragment-index="1"--> `${\color{blue} {x_n,y_n}}$` <!-- .element: class="fragment" data-fragment-index="1"--> we get:<!-- .element: class="fragment" data-fragment-index="1"-->
`${\color{blue} {x_n}}= {2{\color{green} {x_p}}\above 1pt r-l}-{r+l\above 1pt r-l},{\color{blue} {y_n}} = {2{\color{green} {y_p}}\above 1pt t-b}-{t+b\above 1pt t-b}$`
<!-- .element: class="fragment" data-fragment-index="2"-->

since <!-- .element: class="fragment" data-fragment-index="3"-->
`${\color{blue} {x_n}}={x_c\above 1pt w_c}$`<!-- .element: class="fragment" data-fragment-index="3"-->
and <!-- .element: class="fragment" data-fragment-index="3"-->
`${\color{blue} {y_n}}={y_c\above 1pt w_c}$`<!-- .element: class="fragment" data-fragment-index="3"-->
, solving for <!-- .element: class="fragment" data-fragment-index="3"-->
`${\color{red} {x_c,y_c}}$` <!-- .element: class="fragment" data-fragment-index="3"-->
in terms of <!-- .element: class="fragment" data-fragment-index="3"-->
`$x_e,y_e,z_e$` <!-- .element: class="fragment" data-fragment-index="3"-->
, we get: <!-- .element: class="fragment" data-fragment-index="3"-->
`${\color{red} {x_c}}= {2nx_e\above 1pt r-l}+{(r+l)z_e\above 1pt r-l},{\color{red} {y_c}}= {2ny_e\above 1pt t-b}+{(t+b)z_e\above 1pt t-b}$`<!-- .element: class="fragment" data-fragment-index="3"-->

V:

## Projections: Perspective
### `$x_e$,$y_e$` coordinate mapping

<blockquote>
`$${\color{red} {x_c}}= {2nx_e\above 1pt r-l}+{(r+l)z_e\above 1pt r-l},{\color{red} {y_c}}= {2ny_e\above 1pt t-b}+{(t+b)z_e\above 1pt t-b},w_c=-z_e$$`
</blockquote>

`$\begin{bmatrix} 
x_c \cr 
y_c \cr
z_c \cr
w_c \cr
\end{bmatrix}
= 
\begin{bmatrix}
2n \above 1pt r-l   & 0                 & r+l \above 1pt r-l    & 0                   \cr
0                   & 2n \above 1pt t-b & t+b \above 1pt t-b    & 0                   \cr
.                   & .                 & .                     & .                   \cr
0                   & 0                 & -1                    & 0                   \cr
\end{bmatrix} \bullet \begin{bmatrix} 
x_e \cr 
y_e \cr
z_e \cr
w_e(=1) \cr
\end{bmatrix}
$`

V:

## Projections: Perspective
### `$z_e$` coordinate mapping

`$\begin{bmatrix} 
x_c \cr 
y_c \cr
z_c \cr
w_c \cr
\end{bmatrix}
= 
\begin{bmatrix}
2n \above 1pt r-l   & 0                 & r+l \above 1pt r-l    & 0                   \cr
0                   & 2n \above 1pt t-b & t+b \above 1pt t-b    & 0                   \cr
0                   & 0                 & {\color{green} A}     & {\color{green} B}   \cr
0                   & 0                 & -1                    & 0                   \cr
\end{bmatrix} \bullet \begin{bmatrix} 
x_e \cr 
y_e \cr
z_e \cr
w_e(=1) \cr
\end{bmatrix}
$`

<p class="fragment" data-fragment-index="1">
`$z_n=z_c/w_c={Az_e+Bw_e\above 1pt -z_e}={Az_e+B\above 1pt -z_e}$`
</p>

<p class="fragment" data-fragment-index="2">
To find $A$ and $B$, use the map relation `$z_e \in [n,f] \rightarrow z_n \in [-1,1]$` and replace them above (twice)
</p>

V:

## Projections: Perspective
### `$z_e$` coordinate mapping

`$\begin{bmatrix} 
x_c \cr 
y_c \cr
z_c \cr
w_c \cr
\end{bmatrix}
= 
\begin{bmatrix}
2n \above 1pt r-l & 0                   & r+l \above 1pt r-l    & 0                   \cr
0                   & 2n \above 1pt t-b & t+b \above 1pt t-b    & 0                   \cr
0                   & 0                 & -(f+n) \above 1pt f-n & -2fn \above 1pt f-n \cr
0                   & 0                 & -1                    & 0                   \cr
\end{bmatrix} \bullet \begin{bmatrix} 
x_e \cr 
y_e \cr
z_e \cr
w_e(=1) \cr
\end{bmatrix}
$`
<p class="fragment" data-fragment-index="1">
`$P_c = Persp(l,r,b,t,n,f) \bullet P_e$`
</p>

V:

## Projections: Perspective
### Alternative form: Symmetrical viewing volume (`$l=-r$` and `$b=-t$`)

<blockquote>
`$$l=-r$$`
`$$b=-t$$`
`$$aspectRatio=screenWidth/screenHeight$$`
`$fovy:$` vertical field-of-view (in radians)
</blockquote>

<p class="fragment" data-fragment-index="1">
`$\begin{bmatrix} 
x_c \cr 
y_c \cr
z_c \cr
w_c \cr
\end{bmatrix}
= 
\begin{bmatrix}
1 \above 1pt \tan (fovy/2)aspectRatio & 0                   & 0                     & 0                   \cr
0                                     & \tan (fovy/2)       & 0                     & 0                   \cr
0                                     & 0                   & -(f+n) \above 1pt f-n & -2fn \above 1pt f-n \cr
0                                     & 0                   & -1                    & 0                   \cr
\end{bmatrix} \bullet \begin{bmatrix} 
x_e \cr 
y_e \cr
z_e \cr
w_e(=1) \cr
\end{bmatrix}
$`
</p>

<p class="fragment" data-fragment-index="2">
`$P_c = Persp(fovy,aspectRatio,n,f) \bullet P_e$`
</p>

H:

## References

* [Math primer for graphics and game development](https://tfetimes.com/wp-content/uploads/2015/04/F.Dunn-I.Parberry-3D-Math-Primer-for-Graphics-and-Game-Development.pdf)
* [Processing 2d transformations tutorial](https://www.processing.org/tutorials/transform2d/)
* [Processing shaders tutorial](https://www.processing.org/tutorials/pshader/)
* [Shader Programming for Computational Arts and Design - A Comparison between Creative Coding Frameworks](http://www.scitepress.org/DigitalLibrary/PublicationsDetail.aspx?ID=ysaclbloDHk=&t=1)
* [OpenGL projection matrix](http://www.songho.ca/opengl/gl_projectionmatrix.html)
* [The Perspective and Orthographic Projection Matrix](https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix)

H:

## Acknowledgements

* [Jean Pierre Alfonso](https://www.linkedin.com/in/jean-pierre-alfonso-hoyos-59b46359/), for formatting some [mathjax](https://www.mathjax.org/) formulas
