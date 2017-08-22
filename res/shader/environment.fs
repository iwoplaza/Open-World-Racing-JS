precision mediump float;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vNormal;

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