export function handleFileSelect(event, name) {
  const file = event.target.files[0];
  if (!file.type.match('image.*')) {
    alert('invalid file type. Please select an image file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const size = getOptimalSize(img.width, img.height);
      const originalCanvas = document.getElementById(`${name}OriginalCanvas`);
      const originalCtx = originalCanvas.getContext('2d');
      const JSCanvas = document.getElementById(`${name}JS`);
      const WASMCanvas = document.getElementById(`${name}WASM`);
      originalCanvas.width = size.width;
      originalCanvas.height = size.height;
      JSCanvas.width = size.width;
      JSCanvas.height = size.height;
      WASMCanvas.width = size.width;
      WASMCanvas.height = size.height;
      originalCtx.drawImage(img, 0, 0, size.width, size.height);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function getOptimalSize(width, height) {
  const maxSize = 512;

  // 计算缩放比例
  const scale = Math.min(maxSize / width, maxSize / height);
  let newWidth = Math.floor(width * scale);
  let newHeight = Math.floor(height * scale);

  // 调整为 2 的幂次方
  newWidth = nearestPowerOfTwo(newWidth);
  newHeight = nearestPowerOfTwo(newHeight);

  return { width: newWidth, height: newHeight };
}

function nearestPowerOfTwo(n) {
  return Math.pow(2, Math.round(Math.log(n) / Math.log(2)));
}

export const displayImage = (ctx, data, width, height, handleIter) => {
  const imageData = ctx.createImageData(width, height);
  const imgData = imageData.data;

  for (let i = 0; i < data.length; i++) {
    const gray = handleIter(data[i]);
    const idx = i * 4;
    imgData[idx] = gray;        // R
    imgData[idx + 1] = gray;    // G  
    imgData[idx + 2] = gray;    // B
    imgData[idx + 3] = 255;     // A
  }

  ctx.putImageData(imageData, 0, 0);
}

export function convertToGrayscale(imageData) {
  const data = imageData.data;
  const grayData = new Float64Array(data.length / 4);

  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    grayData[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  return grayData;
}

export function computeMagnitudeSpectrum(fftData, width, height) {
  // 计算幅度谱
  const magnitude = new Float64Array(width * height);
  let maxMagnitude = 0;

  for (let i = 0; i < fftData.length; i++) {
    const real = fftData[i].real;
    const imag = fftData[i].imag;
    magnitude[i] = Math.sqrt(real * real + imag * imag);
    if (magnitude[i] > maxMagnitude) {
      maxMagnitude = magnitude[i];
    }
  }

  // 对幅度取对数并归一化
  for (let i = 0; i < magnitude.length; i++) {
    magnitude[i] = Math.log(1 + magnitude[i]) / Math.log(1 + maxMagnitude);
  }

  // 将零频分量移动到中心
  const shifted = new Float64Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const newX = (x + width / 2) % width;
      const newY = (y + height / 2) % height;

      const idx = y * width + x;
      const newIdx = newY * width + newX;

      shifted[idx] = magnitude[newIdx];
    }
  }

  return shifted;
}
