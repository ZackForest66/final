export const organicBlobVertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const organicBlobFragmentShader = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

// Simplex noise functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
         + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                          dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 1.0;
  float freq = 1.0;
  for(int i = 0; i < 5; i++) {
    sum += amp * snoise(p * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return sum;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  float n1 = fbm(uv * 2.5 + u_time * 0.008);
  float n2 = fbm(uv * 3.0 - u_time * 0.006 + 10.0);

  vec3 cream = vec3(0.98, 0.965, 0.945);
  vec3 coral = vec3(1.0, 0.42, 0.21);
  vec3 taupe = vec3(0.54, 0.49, 0.45);

  float blend1 = smoothstep(0.3, 0.7, n1);
  float blend2 = smoothstep(0.4, 0.8, n2);

  vec3 color = mix(cream, coral * 0.15, blend1 * 0.3);
  color = mix(color, taupe * 0.2, blend2 * 0.15);

  gl_FragColor = vec4(color, 1.0);
}
`;

export function initOrganicBlobShader(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) return null;

  // Compile shaders
  function compileShader(src: string, type: number) {
    const shader = gl!.createShader(type)!;
    gl!.shaderSource(shader, src);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl!.getShaderInfoLog(shader));
      gl!.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = compileShader(organicBlobVertexShader, gl.VERTEX_SHADER);
  const fs = compileShader(organicBlobFragmentShader, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return null;

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return null;
  }

  gl.useProgram(program);

  // Full screen quad
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(program, 'u_time');
  const uResolution = gl.getUniformLocation(program, 'u_resolution');

  let animationId: number;
  let startTime = performance.now();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    gl!.viewport(0, 0, canvas.width, canvas.height);
  }

  function render() {
    const elapsed = (performance.now() - startTime) / 1000;
    gl!.uniform1f(uTime, elapsed);
    gl!.uniform2f(uResolution, canvas.width, canvas.height);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    animationId = requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize);
  render();

  return {
    destroy() {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      gl!.deleteProgram(program);
      gl!.deleteShader(vs);
      gl!.deleteShader(fs);
      gl!.deleteBuffer(buffer);
    },
  };
}
