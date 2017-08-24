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

out vec4 vColor;
out vec2 vTextureCoord;
out vec3 vNormal;

void main(void) {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor;
    vTextureCoord = aTextureCoord;
    vNormal = (uNMatrix * vec4(aNormal, 1.0)).xyz;
}

[FRAGMENT]

in vec4 vColor;
in vec2 vTextureCoord;
in vec3 vNormal;

uniform sampler2D uSampler;
uniform int uEnableTextures;

void main(void) {
    vec3 lightSource = vec3(5,10,2);

    vec3 L = normalize(lightSource.xyz);
    vec3 diffuseColor = vec3(1,1,1) * (dot(vNormal,L)*0.5+0.5);
    diffuseColor = clamp(diffuseColor, 0.0, 1.0);

    if(uEnableTextures == 1){
        gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*vColor*vec4(diffuseColor, 1.0);
    }else{
        gl_FragColor = vColor*vec4(diffuseColor, 1.0);
    }

    if(gl_FragColor.a == 0.0) discard;
}