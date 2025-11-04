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