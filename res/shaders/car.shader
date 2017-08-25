[VERTEX]

in vec3 aVertexPosition;
in vec2 aTextureCoord;
in vec4 aVertexColor;
in vec3 aNormal;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform vec4 uGlobalColor;

out vec3 vPosition;
out vec4 vColor;
out vec2 vTextureCoord;
out vec3 vNormal;

void main(void) {
    vPosition = (uMMatrix * vec4(aVertexPosition, 1.0)).xyz;
	gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
	vColor = aVertexColor;
	vTextureCoord = aTextureCoord;
	vNormal = (uNMatrix * vec4(aNormal, 1.0)).xyz;
}

[FRAGMENT]

const int MAX_LIGHTS = 10;

in vec3 vPosition;
in vec4 vColor;
in vec2 vTextureCoord;
in vec3 vNormal;

uniform sampler2D uSampler;
uniform int uEnableTextures;
uniform vec3 uBodyColor;

struct Light
{
    vec3 source;
    vec4 ambientColor;
    vec4 diffuseColor;
    float range;
};

uniform Light uLight[MAX_LIGHTS];
uniform int uLightCount;

void main(void) {
	vec3 diffuseColor = vec3(0, 0, 0);

    for(int i = 0; i < MAX_LIGHTS; i++) {
        if(i >= uLightCount)
            break;
    
        vec3 lightSource = uLight[i].source;
        vec4 lightColor = uLight[i].diffuseColor;
        vec4 lightAmbientColor = uLight[i].ambientColor;
        float lightRange = uLight[i].range;
        lightColor.rgb /= lightColor.a;
        lightAmbientColor.rgb /= lightAmbientColor.a;
        
        if(lightRange == -1.0) {
            vec3 L = normalize(lightSource);
            diffuseColor += lightAmbientColor.rgb;
            diffuseColor += clamp(lightColor.rgb * (dot(vNormal,L)*0.5+0.5), 0.0, 1.0);
        }else{
            float att = clamp((1.0 - length(vPosition - lightSource)/lightRange), 0.0, 1.0);
            vec3 L = normalize(lightSource - vPosition);
            diffuseColor += lightAmbientColor.rgb * att * att;
            diffuseColor += clamp(lightColor.rgb * (dot(vNormal,L)*0.5+0.5), 0.0, 1.0) * att * att;
        }
    }
    

	if(uEnableTextures == 1){
		vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)) * vColor * vec4(diffuseColor, 1.0);
		gl_FragColor = vec4(textureColor.rgb, 1.0);
		if(textureColor.a <= 0.1) {
            //Windows
			gl_FragColor = vec4(gl_FragColor.rgb, 0.5);
		}else if(textureColor.a <= 0.5) {
            //Body
			gl_FragColor = vec4(gl_FragColor.rgb*uBodyColor, 1);
		}else if(textureColor.a <= 0.8) {
            //Lights
			gl_FragColor = vec4((texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))).rgb, 1);
		}
	}else{
		gl_FragColor = vColor*vec4(diffuseColor, 1.0);
	}

	if(gl_FragColor.a == 0.0) discard;
}