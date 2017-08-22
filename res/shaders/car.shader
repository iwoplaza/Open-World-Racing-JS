[VERTEX]

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aVertexColor;
attribute vec3 aNormal;

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
	vColor = aVertexColor;
	vTextureCoord = aTextureCoord;
	vNormal = (uNMatrix * vec4(aNormal, 1.0)).xyz;
}

[FRAGMENT]

precision mediump float;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vNormal;

uniform sampler2D uSampler;
uniform int uEnableTextures;
uniform vec3 uBodyColor;

void main(void) {
	vec3 lightSource = vec3(5,10,2);

	vec3 L = normalize(lightSource.xyz);
	vec3 diffuseColor = vec3(1,1,1) * (dot(vNormal,L)*0.5+0.5);
	diffuseColor = clamp(diffuseColor, 0.0, 1.0);

	if(uEnableTextures == 1){
		vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*vColor*vec4(diffuseColor, 1.0);
		gl_FragColor = vec4(textureColor.rgb, 1.0);
		if(textureColor.a <= 0.1) {
			gl_FragColor = vec4(gl_FragColor.rgb, 0.5);
		}else if(textureColor.a <= 0.5) {
			gl_FragColor = vec4(gl_FragColor.rgb*uBodyColor, 1);
		}else if(textureColor.a <= 0.8) {
			gl_FragColor = vec4((texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))).rgb, 1);
		}
	}else{
		gl_FragColor = vColor*vec4(diffuseColor, 1.0);
	}

	if(gl_FragColor.a == 0.0) discard;
}