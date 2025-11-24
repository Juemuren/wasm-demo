import init, {
  greet,
  add as addWASM,
  fibonacci_iterative as fibonacciWASM,
  sieve as sieveWASM,
  compute_mandelbrot as mandelbrotWASM,
  fft2d as fftWASM,
} from "./pkg/wasm.js";
import {
  add as addJS,
  fibonacciIterative as fibonacciJS,
  sieve as sieveJS,
  computeMandelbrot as mandelbrotJS,
  fft2d as fftJS,
} from "./src/lib.js"
import {
  handleFileSelect,
  displayImage,
  convertToGrayscale,
  computeMagnitudeSpectrum,
} from "./src/utils.js"


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

  const n = parseInt(document.getElementById('mandelbrotInput').value) || 0;

  const startTime = performance.now();
  const result = type === "JS" ? mandelbrotJS(width, height, n) : mandelbrotWASM(width, height, n);
  const endTime = performance.now();

  displayImage(ctx, result, width, height, (val) =>
    val === n ? 0 : Math.min(255, Math.floor(val * 255 / n))
  );

  document.getElementById(`mandelbrotResult${type}`).innerHTML =
    `[${type}] Mandelbrot(${n}), Time: ${(endTime - startTime).toFixed(3)} ms`;
}

function FFT(type) {
  const originalCanvas = document.getElementById('FFTOriginalCanvas');
  const originalCtx = originalCanvas.getContext('2d');
  const width = originalCanvas.width;
  const height = originalCanvas.height;
  const fftCanvas = document.getElementById(`FFT${type}`);
  const fftCtx = fftCanvas.getContext('2d');

  const imageData = originalCtx.getImageData(0, 0, width, height);
  const grayData = convertToGrayscale(imageData);

  const startTime = performance.now();
  const fftData = type === "JS" ? fftJS(grayData, width, height) : fftWASM(grayData, width, height);
  const endTime = performance.now();

  const magnitude = computeMagnitudeSpectrum(fftData, width, height);
  displayImage(fftCtx, magnitude, width, height, (val) =>
    Math.floor(val * 255)
  );

  document.getElementById(`FFTResult${type}`).innerHTML =
    `[${type}] FFT, Time: ${(endTime - startTime).toFixed(3)} ms`;
}

init().then(() => {
  greet("WebAssembly");
  window.add = add
  window.fibonacci = fibonacci
  window.sieve = sieve
  window.mandelbrot = mandelbrot
  window.FFT = FFT
  window.handleFileSelect = handleFileSelect
});
