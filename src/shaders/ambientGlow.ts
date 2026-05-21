export const ambientGlowVertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const ambientGlowFragmentShader = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // Slowly moving soft glow centers
  vec2 center1 = vec2(0.3 + 0.15 * sin(u_time * 0.15), 0.4 + 0.1 * cos(u_time * 0.12));
  vec2 center2 = vec2(0.7 + 0.1 * cos(u_time * 0.1), 0.6 + 0.12 * sin(u_time * 0.18));

  // Breathing animation
  float breathe = 0.5 + 0.5 * sin(u_time * 0.785); // ~8s period
  float glow1Intensity = 0.055 + 0.015 * breathe;
  float glow2Intensity = 0.035 + 0.015 * breathe;

  float glow1 = exp(-length(uv - center1) * 4.0) * glow1Intensity;
  float glow2 = exp(-length(uv - center2) * 3.5) * glow2Intensity;

  vec3 baseColor = vec3(0.102, 0.102, 0.102);
  vec3 coralGlow = vec3(1.0, 0.42, 0.21) * glow1;
  vec3 creamGlow = vec3(0.98, 0.965, 0.945) * glow2;

  gl_FragColor = vec4(baseColor + coralGlow + creamGlow, 1.0);
}
`;

export function initAmbientGlowShader(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) return null;

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

  const vs = compileShader(ambientGlowVertexShader, gl.VERTEX_SHADER);
  const fs = compileShader(ambientGlowFragmentShader, gl.FRAGMENT_SHADER);
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
