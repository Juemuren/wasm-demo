export function add(a, b) {
  return a + b;
}

export function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export function fibonacciIterative(n) {
  if (n <= 1) return n;

  let a = 0;
  let b = 1;

  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }

  return b;
}

export function fibonacciMemoized(n) {
  const memo = new Array(n + 1).fill(0);

  function fib(n) {
    if (n <= 1) return n;

    if (memo[n] !== 0) {
      return memo[n];
    }

    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
  }

  return fib(n);
}

export function sieve(n) {
  const primes = [];
  const isPrime = new Array(n + 1).fill(true);
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) {
      primes.push(i);
      for (let j = i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  return primes;
}

export function matrixMultiply(a, b, n) {
  const result = new Array(n * n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      for (let j = 0; j < n; j++) {
        result[i * n + j] += a[i * n + k] * b[k * n + j];
      }
    }
  }
  return result;
}

export function computeMandelbrot(width, height, maxIter) {
    const output = new Array(width * height);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cx = (x / width) * 3.5 - 2.5;
            const cy = (y / height) * 2.0 - 1.0;
            
            let zx = 0;
            let zy = 0;
            let iter = 0;
            
            while (zx * zx + zy * zy <= 4 && iter < maxIter) {
                const temp = zx * zx - zy * zy + cx;
                zy = 2 * zx * zy + cy;
                zx = temp;
                iter++;
            }
            
            output[y * width + x] = iter;
        }
    }
    
    return output;
}