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

function fft1d(data) {
  const N = data.length;

  if (N === 1) {
    return [data[0]];
  }

  const even = new Array(N / 2);
  const odd = new Array(N / 2);

  for (let i = 0; i < N / 2; i++) {
    even[i] = data[2 * i];
    odd[i] = data[2 * i + 1];
  }

  const evenFFT = fft1d(even);
  const oddFFT = fft1d(odd);

  const result = new Array(N);

  for (let k = 0; k < N / 2; k++) {
    const angle = -2 * Math.PI * k / N;
    const twiddle = {
      real: Math.cos(angle),
      imag: Math.sin(angle)
    };

    const product = {
      real: twiddle.real * oddFFT[k].real - twiddle.imag * oddFFT[k].imag,
      imag: twiddle.real * oddFFT[k].imag + twiddle.imag * oddFFT[k].real
    };

    result[k] = {
      real: evenFFT[k].real + product.real,
      imag: evenFFT[k].imag + product.imag
    };

    result[k + N / 2] = {
      real: evenFFT[k].real - product.real,
      imag: evenFFT[k].imag - product.imag
    };
  }

  return result;
}

export function fft2d(data, width, height) {
  const complexData = new Array(width * height);
  for (let i = 0; i < data.length; i++) {
    complexData[i] = { real: data[i], imag: 0 };
  }

  for (let y = 0; y < height; y++) {
    const row = complexData.slice(y * width, (y + 1) * width);
    const fftRow = fft1d(row);
    for (let x = 0; x < width; x++) {
      complexData[y * width + x] = fftRow[x];
    }
  }

  for (let x = 0; x < width; x++) {
    const col = new Array(height);
    for (let y = 0; y < height; y++) {
      col[y] = complexData[y * width + x];
    }
    const fftCol = fft1d(col);
    for (let y = 0; y < height; y++) {
      complexData[y * width + x] = fftCol[y];
    }
  }

  return complexData;
}
