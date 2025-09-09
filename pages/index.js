// pages/index.jsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top nav */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center text-white font-bold">P</div>
            <div>
              <h1 className="text-lg font-semibold">PixelPro</h1>
              <p className="text-xs text-gray-500 -mt-0.5">Professional, client-side image tools</p>
            </div>
          </div>

         

          {/* mobile menu CTA */}
          <div className="md:hidden">
            <Link href="/pixelpro" className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white">Open</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900">
              Edit and export images — fast, private, and simple.
            </h2>
            <p className="mt-4 text-gray-600 max-w-xl">
              PixelPro is a lightweight, client-side image editor for resizing, enhancing and exporting images — no uploads, no accounts.
              Perfect for designers, content creators and teams who want reliable image outputs without fuss.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/pixelpro" className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700">
                Open Editor
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>

              <a href="#features" className="inline-flex items-center gap-2 px-4 py-3 border rounded-md text-sm text-gray-700 bg-white hover:shadow-sm">
                Features
              </a>
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-100 w-10 h-10 grid place-items-center text-gray-700">✓</div>
                <div>
                  <div className="font-medium text-gray-800">Client-side</div>
                  <div className="text-xs">Your images never leave your browser</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-100 w-10 h-10 grid place-items-center text-gray-700">⚡</div>
                <div>
                  <div className="font-medium text-gray-800">Fast</div>
                  <div className="text-xs">Instant adjustments on modern browsers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual / demo panel */}
          <div className="relative">
            <div className="bg-white border rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Editor preview</div>
                <div className="text-xs text-gray-400">Client-side</div>
              </div>

              <div className="mt-4 bg-gray-100 rounded-md overflow-hidden h-64 md:h-72 flex items-center justify-center">
                {/* simple illustrative SVG mockup */}
                <svg width="80%" height="80%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                  <rect x="4" y="4" width="792" height="592" rx="12" fill="#ffffff" stroke="#e6e9ee"/>
                  <rect x="28" y="32" width="460" height="360" rx="8" fill="#f8fafc" stroke="#e9eef4"/>
                  <rect x="504" y="32" width="248" height="360" rx="8" fill="#ffffff" stroke="#e9eef4"/>
                  <rect x="44" y="52" width="432" height="60" rx="6" fill="#eef2ff"/>
                  <rect x="48" y="132" width="160" height="40" rx="6" fill="#f1f5f9"/>
                  <rect x="224" y="132" width="256" height="200" rx="6" fill="#e6eef8"/>
                  <circle cx="120" cy="220" r="28" fill="#c7d2fe"/>
                </svg>
              </div>

              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <div>Resize • Enhance • Export</div>
                <div>PNG / JPEG / WebP</div>
              </div>
            </div>

            {/* subtle badge */}
            <div className="absolute -bottom-3 left-6 bg-white px-3 py-1 rounded-md text-xs border shadow-sm text-gray-600">
              Works offline · Privacy-first
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900">Core features</h3>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            A focused set of tools for manual and automated optimization — design-friendly controls with predictable results.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard title="Resize & Crop" desc="Precise pixel controls, aspect-ratio locking and fast resizing." icon="📐" />
            <FeatureCard title="Enhance" desc="Brightness, contrast, saturation, hue and blur with instant preview." icon="🎛️" />
            <FeatureCard title="Export" desc="Export to JPEG, PNG or WebP with quality control and client-side download." icon="💾" />
          </div>
        </section>

        {/* Workflow / how it works */}
        <section id="how-it-works" className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900">How it works</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard step="1" title="Upload" desc="Drop an image or choose from your device. No uploads or accounts required." />
            <StepCard step="2" title="Adjust" desc="Tweak sliders, apply filters, or auto-enhance in real-time." />
            <StepCard step="3" title="Export" desc="Download optimized images in the format and quality you need." />
          </div>
        </section>

        {/* CTA strip */}
        <section className="mt-12 bg-white border rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-600">Ready to edit?</div>
            <div className="text-lg font-semibold text-gray-900">Open the editor and optimize your images.</div>
          </div>
          <div className="flex gap-3">
            <Link href="/pixelpro" className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700">Open Editor</Link>
            <a href="#features" className="px-4 py-2 border rounded-md text-gray-700">Explore features</a>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="max-w-7xl mx-auto p-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} PixelPro — Built for privacy</div>
          <div className="flex gap-4">
            <a className="hover:text-gray-900">Privacy</a>
            <a className="hover:text-gray-900">Terms</a>
            <a className="hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-md bg-gray-100 grid place-items-center text-xl">{icon}</div>
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, title, desc }) {
  return (
    <div className="bg-gray-50 border rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white border grid place-items-center font-semibold text-indigo-600">{step}</div>
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{desc}</div>
        </div>
      </div>
    </div>
  );
}
