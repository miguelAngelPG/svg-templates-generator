import { FeatureCard } from "@/components/molecules/FeatureCard";
import { Play, Image as ImageIcon, LayoutTemplate } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-purple-900/30 border border-purple-700/50 text-purple-300 text-xs font-mono mb-6">
            v2.0 NOW WITH ATOMIC ARCHITECTURE
          </span>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Templates Chonchos
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate toolkit for developers. Generate <span className="text-purple-400">GIFs</span>, <span className="text-pink-400">SVGs</span>, and <span className="text-cyan-400">Profile Templates</span> in seconds with real-time preview.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="/gif-studio" className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
              Launch Studio
            </a>
            <a href="https://github.com" target="_blank" className="px-8 py-4 bg-[#111] border border-gray-800 text-white font-medium rounded-lg hover:border-gray-600 transition-colors">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold mb-10 text-center text-gray-200">What do you want to create?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="GIF Studio"
            description="Create high-performance animated GIFs using our serverless worker engine. Live preview, customizable timing, and optimized encoding."
            icon={<Play className="w-6 h-6" />}
            href="/gif-studio"
            color="purple"
          />

          <FeatureCard
            title="SVG Generator"
            description="Generate lightweight, scalable SVG animations for your docs or website. CSS Keyframes support included."
            icon={<ImageIcon className="w-6 h-6" />}
            href="/generator"
            color="pink"
          />

          <FeatureCard
            title="Templates"
            description="Ready-to-use profile headers, stat cards, and quote banners. Perfect for spicing up your GitHub Readme."
            icon={<LayoutTemplate className="w-6 h-6" />}
            href="/templates"
            color="cyan"
          />
        </div>
      </section>

      <footer className="text-center py-10 text-gray-600 text-sm border-t border-gray-900/50 mt-10">
        <p>Made with ❤️ by Miguel Angel Pacheco</p>
      </footer>
    </main>
  );
}
