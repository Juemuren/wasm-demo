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
  const num1 = parseInt(document.getElementById('add-input-1').value) || 0;
  const num2 = parseInt(document.getElementById('add-input-2').value) || 0;

  const result = type === "js" ? addJS(num1, num2) : addWASM(num1, num2);

  document.getElementById(`add-result-${type}`).innerHTML =
    `[${type}] ${num1} + ${num2} = ${result}`;
}

function runBenchmark(config) {
  const {
    type,
    name,
    jsFunc,
    wasmFunc,
    getAdditionalArgs = () => [],
    processResult = null,
    formatResult = result => result
  } = config;

  // 获取输入值
  const inputId = `${name}-input`
  const inputValue = document.getElementById(inputId)
    ? parseInt(document.getElementById(inputId).value) || 0
    : null

  // 获取额外参数
  const additionalArgs = getAdditionalArgs(type);

  // 执行基准测试
  const startTime = performance.now();
  let result
  if (inputValue)
    result = type === "js"
      ? jsFunc(inputValue, ...additionalArgs)
      : wasmFunc(inputValue, ...additionalArgs);
  else
    result = type === "js"
      ? jsFunc(...additionalArgs)
      : wasmFunc(...additionalArgs)
  const endTime = performance.now();
  const executionTime = (endTime - startTime).toFixed(3);

  // 处理结果
  if (processResult) {
    processResult(result, type, inputValue);
  }

  // 更新结果显示
  const resultId = `${name}-result-${type}`
  document.getElementById(resultId).innerHTML =
    `[${type.toUpperCase()}: ${executionTime} ms] ${formatResult(result, inputValue)}`;
}

function fibonacci(type) {
  runBenchmark({
    type,
    name: "fibonacci",
    jsFunc: fibonacciJS,
    wasmFunc: fibonacciWASM,
    formatResult: (result, inputValue) => 
      `Fibonacci(${inputValue}) = ${result}`
  });
}

function sieve(type) {
  runBenchmark({
    type,
    name: "sieve",
    jsFunc: sieveJS,
    wasmFunc: sieveWASM,
    formatResult: (result, inputValue) =>
      `There are ${result.length} primes within ${inputValue} by sieve of Eratosthenes`
  });
}

function mandelbrot(type) {
  runBenchmark({
    type,
    name: "mandelbrot",
    jsFunc: mandelbrotJS,
    wasmFunc: mandelbrotWASM,
    getAdditionalArgs: (type) => {
      const width = parseInt(document.getElementById(`mandelbrot-input-width`).value) || 400;
      const height = parseInt(document.getElementById(`mandelbrot-input-height`).value) || 300;
      document.getElementById(`mandelbrot-canvas-${type}`).width = width;
      document.getElementById(`mandelbrot-canvas-${type}`).height = height;
      return [width, height]
    },
    processResult: (result, type, inputValue) => {
      const canvas = document.getElementById(`mandelbrot-canvas-${type}`);
      const ctx = canvas.getContext('2d');
      displayImage(ctx, result, canvas.width, canvas.height, (val) =>
        val === inputValue ? 0 : Math.min(255, Math.floor(val * 255 / inputValue))
      );
    },
    formatResult: (result, inputValue) =>
      `The Mandelbrot Set with ${result.length} pixels after ${inputValue} iterations`
  });
}

function FFT(type) {
  runBenchmark({
    type,
    name: "fft",
    jsFunc: fftJS,
    wasmFunc: fftWASM,
    getAdditionalArgs: () => {
      const canvas = document.getElementById('fft-canvas');
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const grayData = convertToGrayscale(imageData);
      return [grayData, canvas.width, canvas.height];
    },
    processResult: (result, type) => {
      const canvas = document.getElementById(`fft-canvas-${type}`);
      const ctx = canvas.getContext('2d');
      const magnitude = computeMagnitudeSpectrum(result, canvas.width, canvas.height);
      displayImage(ctx, magnitude, canvas.width, canvas.height, (val) =>
        Math.floor(val * 255)
      );
    },
    formatResult: () =>
      'The Fast Fourier Transform frequency spectrum'
  });
}

init().then(() => {
  window.greet = greet
  window.handleFileSelect = handleFileSelect
  window.add = add
  window.fibonacci = fibonacci
  window.sieve = sieve
  window.mandelbrot = mandelbrot
  window.FFT = FFT
});
