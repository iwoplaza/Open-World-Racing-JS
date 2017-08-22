attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aVertexColor;
attribute vec3 aNormal;
attribute vec4 aBoneIndicies;
attribute vec4 aBoneWeights;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform vec4 uGlobalColor;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor*uGlobalColor;
    vTextureCoord = aTextureCoord;
    vNormal = (uNMatrix * vec4(aNormal, 1.0)).xyz;
}