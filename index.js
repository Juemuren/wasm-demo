import init, {
  greet,
  add as addWASM,
  fibonacci_iterative as fibonacciWASM,
  sieve as sieveWASM,
  compute_mandelbrot as mandelbrotWASM
} from "./pkg/hello_wasm.js";
import {
  add as addJS,
  fibonacciIterative as fibonacciJS,
  sieve as sieveJS,
  computeMandelbrot as mandelbrotJS
} from "./src/lib.js"

function add(type) {
  const num1 = parseInt(document.getElementById('num1').value) || 0;
  const num2 = parseInt(document.getElementById('num2').value) || 0;

  const result = type === "JS" ? addJS(num1, num2) : addWASM(num1, num2);

  document.getElementById(`sumResult${type}`).innerHTML =
    `[${type}] Sum: ${num1} + ${num2} = ${result}`;
}

function fibonacci(type) {
  const n = parseInt(document.getElementById('fibInput').value) || 0;

  const startTime = performance.now();
  const result = type === "JS" ? fibonacciJS(n) : fibonacciWASM(n);
  const endTime = performance.now();

  document.getElementById(`fibResult${type}`).innerHTML =
    `[${type}] Fibonacci(${n}): ${result}, Time: ${(endTime - startTime).toFixed(3)} ms`;
}

function sieve(type) {
  const n = parseInt(document.getElementById('sieveInput').value) || 0;

  const startTime = performance.now();
  const result = type === "JS" ? sieveJS(n) : sieveWASM(n);
  const endTime = performance.now();

  document.getElementById(`sieveResult${type}`).innerHTML =
    `[${type}] Sieve(${n}): ${result.length}, Time: ${(endTime - startTime).toFixed(3)} ms`;
}

function mandelbrot(type) {
  const canvas = document.getElementById(`mandelbrot${type}`);
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data

  const n = parseInt(document.getElementById('mandelbrotInput').value) || 0;

  const startTime = performance.now();
  const result = type === "JS" ? mandelbrotJS(width, height, n) : mandelbrotWASM(width, height, n);
  const endTime = performance.now();

  for (let i = 0; i < result.length; i++) {
    const iter = result[i];
    const gray = iter === n ? 0 : Math.min(255, Math.floor(iter * 255 / n));
    const idx = i * 4;
    data[idx] = gray;        // R
    data[idx + 1] = gray;    // G
    data[idx + 2] = gray;    // B
    data[idx + 3] = 255;     // A
  }

  ctx.putImageData(imageData, 0, 0);

  document.getElementById(`mandelbrotResult${type}`).innerHTML =
    `[${type}] Mandelbrot(${n}), Time: ${(endTime - startTime).toFixed(3)} ms`;
}

init().then(() => {
  greet("WebAssembly");
  window.add = add
  window.fibonacci = fibonacci
  window.sieve = sieve
  window.mandelbrot = mandelbrot
});


