use std::f64::consts::PI;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u128 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

#[wasm_bindgen]
pub fn fibonacci_iterative(n: u32) -> u128 {
    if n <= 1 {
        return n.into();
    }

    let mut a = 0;
    let mut b = 1;

    for _ in 2..=n {
        let c = a + b;
        a = b;
        b = c;
    }

    b
}

#[wasm_bindgen]
pub fn sieve(n: u32) -> Vec<u32> {
    let mut primes = Vec::new();
    let mut is_prime = vec![true; (n + 1) as usize];
    for i in 2..=n {
        if is_prime[i as usize] {
            primes.push(i);
            for j in (i..=n).step_by(i as usize) {
                is_prime[j as usize] = false;
            }
        }
    }
    primes
}

#[wasm_bindgen]
pub fn compute_mandelbrot(max_iter: usize, width: usize, height: usize) -> Vec<usize> {
    let mut output = vec![0; width * height];

    for y in 0..height {
        for x in 0..width {
            let cx = (x as f64 / width as f64) * 3.5 - 2.5;
            let cy = (y as f64 / height as f64) * 2.0 - 1.0;

            let mut zx = 0.0;
            let mut zy = 0.0;
            let mut iter = 0;

            while zx * zx + zy * zy <= 4.0 && iter < max_iter {
                let temp = zx * zx - zy * zy + cx;
                zy = 2.0 * zx * zy + cy;
                zx = temp;
                iter += 1;
            }

            output[y * width + x] = iter;
        }
    }

    output
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct Complex {
    real: f64,
    imag: f64,
}

#[wasm_bindgen]
impl Complex {
    #[wasm_bindgen(getter)]
    pub fn real(&self) -> f64 {
        self.real
    }
    
    #[wasm_bindgen(getter)]
    pub fn imag(&self) -> f64 {
        self.imag
    }
}

fn fft1d(data: &[Complex]) -> Vec<Complex> {
    let n = data.len();
    if n == 1 {
        return vec![data[0]];
    }

    let mut even = Vec::with_capacity(n/2);
    let mut odd = Vec::with_capacity(n/2);
    for i in 0..n/2 {
        even.push(data[2*i]);
        odd.push(data[2*i + 1]);
    }

    let even_fft = fft1d(&even);
    let odd_fft = fft1d(&odd);
    let mut result = vec![Complex { real: 0.0, imag: 0.0 }; n];

    for k in 0..n/2 {
        let angle = -2.0 * PI * k as f64 / n as f64;
        let twiddle = Complex {
            real: angle.cos(),
            imag: angle.sin(),
        };

        let product = Complex {
            real: twiddle.real * odd_fft[k].real - twiddle.imag * odd_fft[k].imag,
            imag: twiddle.real * odd_fft[k].imag + twiddle.imag * odd_fft[k].real,
        };

        result[k] = Complex {
            real: even_fft[k].real + product.real,
            imag: even_fft[k].imag + product.imag,
        };

        result[k + n/2] = Complex {
            real: even_fft[k].real - product.real,
            imag: even_fft[k].imag - product.imag,
        };
    }

    result
}

#[wasm_bindgen]
pub fn fft2d(data: &[f64], width: usize, height: usize) -> Vec<Complex> {
    let mut complex_data: Vec<Complex> = data.iter()
        .map(|&x| Complex { real: x, imag: 0.0 })
        .collect();

    for y in 0..height {
        let row_start = y * width;
        let row_end = (y + 1) * width;
        let row_fft = fft1d(&complex_data[row_start..row_end]);
        complex_data[row_start..row_end].copy_from_slice(&row_fft);
    }

    let mut col_buf = vec![Complex { real: 0.0, imag: 0.0 }; height];
    for x in 0..width {
        for y in 0..height {
            col_buf[y] = complex_data[y * width + x];
        }
        let col_fft = fft1d(&col_buf);
        for y in 0..height {
            complex_data[y * width + x] = col_fft[y];
        }
    }

    complex_data
}