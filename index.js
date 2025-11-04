import init, {
  greet,
  add as addWasm,
  fibonacci_iterative as fibonacciWasm,
  sieve as sieveWasm,
  matrix_multiply as matrixWasm
} from "./pkg/hello_wasm.js";
import {
  add as addJS,
  fibonacciIterative as fibonacciJS,
  sieve as sieveJS,
  matrixMultiply as matrixJS
} from "./src/lib.js"

function add(type) {
  const num1 = parseInt(document.getElementById('num1').value) || 0;
  const num2 = parseInt(document.getElementById('num2').value) || 0;

  const result = type === "JS" ? addJS(num1, num2) : addWasm(num1, num2);

  document.getElementById(`sumResult${type}`).innerHTML =
    `[${type}] Sum: ${num1} + ${num2} = ${result}`;
}

function fibonacci(type) {
  const n = parseInt(document.getElementById('fibInput').value) || 0;

  const startTime = performance.now();
  const result = type === "JS" ? fibonacciJS(n) : fibonacciWasm(n);
  const endTime = performance.now();

  document.getElementById(`fibResult${type}`).innerHTML =
    `[${type}] Fibonacci(${n}): ${result}, Time: ${(endTime - startTime).toFixed(3)} ms`;
}

function sieve(type) {
  const n = parseInt(document.getElementById('sieveInput').value) || 0;

  const startTime = performance.now();
  const result = type === "JS" ? sieveJS(n) : sieveWasm(n);
  const endTime = performance.now();

  document.getElementById(`sieveResult${type}`).innerHTML =
    `[${type}] Sieve(${n}): ${result.length}, Time: ${(endTime - startTime).toFixed(3)} ms`;
}

function matrix(type) {
  const n = parseInt(document.getElementById('matrixInput').value) || 0;

  const a = new Array(n * n).fill(1);
  const b = new Array(n * n).fill(2);

  const startTime = performance.now();
  const result = type === "JS" ? matrixJS(a, b, n) : matrixWasm(a, b, n);
  const endTime = performance.now();

  document.getElementById(`matrixResult${type}`).innerHTML =
    `[${type}] matrix(${n}): ${result[0]}, Time: ${(endTime - startTime).toFixed(3)} ms`;
}

init().then(() => {
  greet("WebAssembly");
  window.add = add
  window.fibonacci = fibonacci
  window.sieve = sieve
  window.matrix = matrix
});


