import { FeatureCard } from "@/components/molecules/FeatureCard";
import { Play, Image as ImageIcon, LayoutTemplate } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col selection:bg-purple-500/30 overflow-hidden relative">

      {/* Background Decor */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Content Area - Centered Vertical Distribution */}
      <div className="flex-1 flex flex-col justify-center lg:justify-center gap-8 max-w-6xl mx-auto px-6 w-full h-full pb-4">

        {/* Compact Hero Section */}
        <section className="text-center relative z-10 shrink-0">
          <span className="inline-block py-1 px-3 rounded-full bg-purple-900/30 border border-purple-700/50 text-purple-300 text-[10px] font-mono mb-4">
            v2.0 NOW WITH ATOMIC ARCHITECTURE
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Templates Chonchos
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed">
            The ultimate toolkit for developers. Generate <span className="text-purple-400">GIFs</span>, <span className="text-pink-400">SVGs</span>, and <span className="text-cyan-400">Profile Templates</span> in seconds with real-time preview.
          </p>

          <div className="flex justify-center gap-4">
            <a href="/gif-studio" className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Launch Studio
            </a>
            <a href="https://github.com" target="_blank" className="px-6 py-3 bg-[#111] border border-gray-800 text-white font-medium rounded-lg hover:border-gray-600 transition-colors text-sm">
              View on GitHub
            </a>
          </div>
        </section>

        {/* Features Grid - No huge vertical padding */}
        <section className="width-full relative z-10 shrink-0">
          <h2 className="text-xl font-bold mb-6 text-center text-gray-200">What do you want to create?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              title="GIF Studio"
              description="Create high-performance animated GIFs using our serverless worker engine. Live preview, customizable timing, and optimized encoding."
              icon={<Play className="w-5 h-5" />}
              href="/gif-studio"
              color="purple"
            />

            <FeatureCard
              title="SVG Generator"
              description="Generate lightweight, scalable SVG animations for your docs or website. CSS Keyframes support included."
              icon={<ImageIcon className="w-5 h-5" />}
              href="/generator"
              color="pink"
            />

            <FeatureCard
              title="Templates"
              description="Ready-to-use profile headers, stat cards, and quote banners. Perfect for spicing up your GitHub Readme."
              icon={<LayoutTemplate className="w-5 h-5" />}
              href="/templates"
              color="cyan"
            />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="shrink-0 text-center py-4 text-gray-700 text-xs border-t border-gray-900/30">
        <p>Made with ❤️ by Miguel Angel Pacheco</p>
      </footer>
    </div>
  );
}
