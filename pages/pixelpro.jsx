import { useEffect, useRef, useState } from 'react';

export default function PixelProPage() {
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainAspect, setMaintainAspect] = useState(true);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [blur, setBlur] = useState(0);

  const [filterName, setFilterName] = useState('none');
  const [format, setFormat] = useState('jpeg');
  const [quality, setQuality] = useState(90);

  function resetEnhancements() {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setHue(0);
    setBlur(0);
    setFilterName('none');
  }

  function handleFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('File must be smaller than 50MB.');
      return;
    }

    setLoadingProgress(10);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setWidth(img.width);
        setHeight(img.height);
        setShowEditor(true);
        setTimeout(() => setLoadingProgress(100), 250);
      };
      img.onerror = () => {
        alert('Failed to load image. Try another file.');
      };
      img.src = e.target.result;
    };
    reader.onerror = () => alert('Failed to read file.');
    reader.readAsDataURL(file);
  }

  function onChooseClick() {
    fileInputRef.current?.click();
  }

  useEffect(() => {
    const dropzone = document.getElementById('dropzone');
    if (!dropzone) return;

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function highlight() {
      dropzone.classList.add('ring', 'ring-offset-2', 'ring-indigo-300');
    }
    function unhighlight() {
      dropzone.classList.remove('ring', 'ring-offset-2', 'ring-indigo-300');
    }

    function handleDrop(e) {
      preventDefaults(e);
      unhighlight();
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, preventDefaults, false);
    });
    ['dragenter', 'dragover'].forEach(name => dropzone.addEventListener(name, highlight, false));
    ['dragleave', 'drop'].forEach(name => dropzone.addEventListener(name, unhighlight, false));
    dropzone.addEventListener('drop', handleDrop, false);

    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(name => dropzone.removeEventListener(name, preventDefaults));
      ['dragenter', 'dragover'].forEach(name => dropzone.removeEventListener(name, highlight));
      ['dragleave', 'drop'].forEach(name => dropzone.removeEventListener(name, unhighlight));
      dropzone.removeEventListener('drop', handleDrop);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = originalImage;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    const filters = [];
    if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
    if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
    if (saturation !== 100) filters.push(`saturate(${saturation}%)`);
    if (hue !== 0) filters.push(`hue-rotate(${hue}deg)`);
    if (blur > 0) filters.push(`blur(${blur}px)`);

    let namedFilter = '';
    switch (filterName) {
      case 'grayscale': namedFilter = 'grayscale(100%)'; break;
      case 'sepia': namedFilter = 'sepia(100%)'; break;
      case 'invert': namedFilter = 'invert(100%)'; break;
      case 'vintage': namedFilter = 'sepia(50%) contrast(120%) brightness(110%)'; break;
      case 'dramatic': namedFilter = 'contrast(150%) brightness(90%) saturate(120%)'; break;
      default: namedFilter = '';
    }

    const finalFilter = [namedFilter, ...filters].filter(Boolean).join(' ');

    ctx.filter = finalFilter || 'none';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
  }, [originalImage, width, height, brightness, contrast, saturation, hue, blur, filterName]);

  function onWidthChange(v) {
    const w = Number(v) || 0;
    if (maintainAspect && originalImage) {
      const ratio = originalImage.height / originalImage.width;
      setHeight(Math.round(w * ratio));
    }
    setWidth(w);
  }

  function onHeightChange(v) {
    const h = Number(v) || 0;
    if (maintainAspect && originalImage) {
      const ratio = originalImage.width / originalImage.height;
      setWidth(Math.round(h * ratio));
    }
    setHeight(h);
  }

  function downloadImage() {
    const canvas = canvasRef.current;
    if (!canvas) {
      alert('No image to download');
      return;
    }

    const mime = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
    const filename = `pixelpro-${Date.now()}.${format === 'jpeg' ? 'jpg' : format}`;
    const q = quality / 100;

    canvas.toBlob((blob) => {
      if (!blob) {
        alert('Failed to generate image.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, mime, q);
  }

  function resetImage() {
    if (!originalImage) return;
    setWidth(originalImage.width);
    setHeight(originalImage.height);
    resetEnhancements();
  }

  function showUploadSection() {
    setShowEditor(false);
    setOriginalImage(null);
    setWidth(0);
    setHeight(0);
    setLoadingProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">PixelPro</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Professional Image Editor</h2>
          <p className="text-gray-600 mt-1">Resize, enhance and export images — lightweight, privacy-friendly (client-side only).</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {!showEditor ? (
            <section id="uploadSection" className="lg:col-span-1 bg-white border rounded-lg p-6 shadow-sm">
              <div
                id="dropzone"
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-300"
                onClick={onChooseClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />

                <div className="text-4xl">📷</div>
                <h3 className="text-lg font-semibold mt-4">Drop an image or click to browse</h3>
                <p className="text-sm text-gray-500 mt-2">Supports JPEG, PNG, WebP, GIF — up to 50MB · Client-side only</p>

                <div className="mt-6">
                  <button onClick={onChooseClick} className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md">Choose Image</button>
                </div>

                {loadingProgress > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="h-2 bg-indigo-500" style={{ width: `${loadingProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </section>
          ) : null}

          {showEditor && (
            <section className="lg:col-span-2 bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b">
                <div>
                  <h3 className="text-lg font-semibold">Image Editor</h3>
                  <p className="text-sm text-gray-500">Making adjustments happens instantly in your browser.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={resetImage} className="px-3 py-1 border rounded text-sm">Reset</button>
                  <button onClick={downloadImage} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Download</button>
                  <button onClick={showUploadSection} className="px-3 py-1 border rounded text-sm">Upload New</button>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                  <div className="w-full">
                    <canvas ref={canvasRef} className="w-full max-h-[600px] rounded-md bg-white" />
                  </div>
                </div>

                <aside className="space-y-4">
                  <div className="bg-white border rounded p-3">
                    <div className="text-sm text-gray-600">Original</div>
                    <div className="font-medium text-gray-800 mt-1">{originalImage ? `${originalImage.width} × ${originalImage.height}px` : '-'}</div>
                    <div className="text-sm text-gray-600 mt-2">Current</div>
                    <div className="font-medium text-gray-800 mt-1">{width} × {height}px</div>
                  </div>

                  <div className="bg-white border rounded p-3">
                    <h4 className="font-semibold text-gray-800">Resize</h4>
                    <label className="block text-sm text-gray-600 mt-2">Width (px)</label>
                    <input type="number" value={width} onChange={(e) => onWidthChange(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" />
                    <label className="block text-sm text-gray-600 mt-2">Height (px)</label>
                    <input type="number" value={height} onChange={(e) => onHeightChange(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" />

                    <div className="flex items-center gap-2 mt-2">
                      <input id="aspectRatio" checked={maintainAspect} onChange={() => setMaintainAspect(!maintainAspect)} type="checkbox" className="h-4 w-4" />
                      <label htmlFor="aspectRatio" className="text-sm text-gray-600">Maintain aspect ratio</label>
                    </div>

                    <button onClick={() => { }} className="mt-3 w-full px-3 py-2 bg-indigo-600 text-white rounded">Apply Resize</button>
                  </div>

                  <div className="bg-white border rounded p-3 space-y-2">
                    <h4 className="font-semibold text-gray-800">Export</h4>
                    <div className="flex gap-2">
                      <button className={`px-2 py-1 rounded border ${format === 'jpeg' ? 'bg-indigo-50 border-indigo-400' : ''}`} onClick={() => setFormat('jpeg')}>JPEG</button>
                      <button className={`px-2 py-1 rounded border ${format === 'png' ? 'bg-indigo-50 border-indigo-400' : ''}`} onClick={() => setFormat('png')}>PNG</button>
                      <button className={`px-2 py-1 rounded border ${format === 'webp' ? 'bg-indigo-50 border-indigo-400' : ''}`} onClick={() => setFormat('webp')}>WebP</button>
                    </div>

                    {format !== 'png' && (
                      <>
                        <label className="text-sm text-gray-600">Quality: {quality}%</label>
                        <input type="range" min="1" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
                      </>
                    )}

                  </div>
                </aside>

                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="p-3 bg-white border rounded">
                    <h4 className="font-semibold">Brightness & Contrast</h4>
                    <label className="text-sm text-gray-600 mt-2">Brightness: {brightness}%</label>
                    <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full" />
                    <label className="text-sm text-gray-600 mt-2">Contrast: {contrast}%</label>
                    <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full" />
                  </div>

                  <div className="p-3 bg-white border rounded">
                    <h4 className="font-semibold">Colors</h4>
                    <label className="text-sm text-gray-600 mt-2">Saturation: {saturation}%</label>
                    <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full" />
                    <label className="text-sm text-gray-600 mt-2">Hue: {hue}°</label>
                    <input type="range" min="0" max="360" value={hue} onChange={(e) => setHue(Number(e.target.value))} className="w-full" />
                  </div>

                  <div className="p-3 bg-white border rounded">
                    <h4 className="font-semibold">Effects</h4>
                    <label className="text-sm text-gray-600 mt-2">Blur: {blur}px</label>
                    <input type="range" min="0" max="10" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full" />

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {['none','grayscale','sepia','invert','vintage','dramatic'].map(f => (
                        <button key={f} onClick={() => setFilterName(f)} className={`text-xs px-2 py-1 rounded border ${filterName === f ? 'bg-indigo-50 border-indigo-400' : ''}`}>{f === 'none' ? 'None' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
                      ))}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button onClick={resetEnhancements} className="px-3 py-1 border rounded text-sm">Reset</button>
                      <button onClick={() => { setBrightness(110); setContrast(115); setSaturation(110); }} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Auto Enhance</button>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}
        </div>

      </main>

      <footer className="border-t mt-8">
        <div className="max-w-7xl mx-auto p-4 text-sm text-gray-500">Built with client-side canvas — your images never leave your browser.</div>
      </footer>
    </div>
  );
}
