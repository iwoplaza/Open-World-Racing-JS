[VERTEX]

const int MAX_LIGHTS = 10;

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
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
    vPosition = (uMMatrix * vec4(aVertexPosition, 1.0)).xyz;
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

struct Light
{
    vec3 source;
    vec3 ambientColor;
    vec3 diffuseColor;
    float range;
};

uniform Light uLight[MAX_LIGHTS];
uniform int uLightCount;

uniform sampler2D uSampler;
uniform int uEnableTextures;

void main(void) {
    vec3 diffuseColor = vec3(0, 0, 0);

    for(int i = 0; i < MAX_LIGHTS; i++) {
        if(i >= uLightCount)
            break;
        
        if(uLight[i].range == -1.0) {
            vec3 L = normalize(uLight[i].source);
            diffuseColor += uLight[i].ambientColor;
            diffuseColor += clamp(uLight[i].diffuseColor * (dot(vNormal,L)*0.5+0.5), 0.0, 1.0);
        }else{
            vec3 vertexToLight = uLight[i].source - vPosition;
            float att = clamp((1.0 - length(vertexToLight)/uLight[i].range), 0.0, 1.0);
            diffuseColor += uLight[i].ambientColor * att * att;
            diffuseColor += clamp(uLight[i].diffuseColor * (dot(vNormal,normalize(vertexToLight))*0.5+0.5), 0.0, 1.0) * att * att;
        }
    }
    
    if(uEnableTextures == 1){
        gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*vColor*vec4(diffuseColor, 1.0);
    }else{
        gl_FragColor = vColor*vec4(diffuseColor, 1.0);
    }

    if(gl_FragColor.a == 0.0) discard;
}