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
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2)
    }
}

#[wasm_bindgen]
pub fn fibonacci_iterative(n: u32) -> u32 {
    if n <= 1 {
        return n;
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
pub fn fibonacci_memoized(n: u32) -> u32 {
    let mut memo = vec![0; (n + 1) as usize];
    
    fn fib(n: u32, memo: &mut Vec<u32>) -> u32 {
        if n <= 1 {
            return n;
        }
        
        if memo[n as usize] != 0 {
            return memo[n as usize];
        }
        
        memo[n as usize] = fib(n - 1, memo) + fib(n - 2, memo);
        memo[n as usize]
    }
    
    fib(n, &mut memo)
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
pub fn matrix_multiply(a: &[f64], b: &[f64], n: usize) -> Vec<f64> {
    let mut result = vec![0.0; n * n];
    for i in 0..n {
        for k in 0..n {
            for j in 0..n {
                result[i * n + j] += a[i * n + k] * b[k * n + j];
            }
        }
    }
    result
}

#[wasm_bindgen]
pub fn compute_mandelbrot(width: usize, height: usize, max_iter: usize) -> Vec<usize> {
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
