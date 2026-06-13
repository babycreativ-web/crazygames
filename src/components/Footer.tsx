import Link from "next/link";
import { Gamepad2, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-slate-950/80 backdrop-blur-sm mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                <Gamepad2 className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                CrazyArcade
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[250px]">
              Play thousands of free online HTML5 games directly in your browser. No downloads, no installs — just fun!
            </p>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-sm font-bold text-slate-300 mb-1">Company</h4>
            <Link href="/about" className="text-xs text-slate-500 hover:text-violet-400 transition-colors w-fit">
              About
            </Link>
            <Link href="/info-for-parents" className="text-xs text-slate-500 hover:text-violet-400 transition-colors w-fit">
              Info for parents
            </Link>
            <a href="mailto:babycreativ@gmail.com" className="text-xs text-slate-500 hover:text-violet-400 transition-colors w-fit flex items-center gap-1.5">
              <Mail className="h-3 w-3" />
              Contact us
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-sm font-bold text-slate-300 mb-1">Legal</h4>
            <Link href="/terms" className="text-xs text-slate-500 hover:text-violet-400 transition-colors w-fit">
              Terms &amp; conditions
            </Link>
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-violet-400 transition-colors w-fit">
              Privacy
            </Link>
          </div>

          {/* Browse */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-sm font-bold text-slate-300 mb-1">Browse</h4>
            <Link href="/?filter=new" className="text-xs text-slate-500 hover:text-violet-400 transition-colors w-fit">
              New games
            </Link>
            <Link href="/?filter=trending" className="text-xs text-slate-500 hover:text-violet-400 transition-colors w-fit">
              Trending
            </Link>
            <Link href="/?category=Action" className="text-xs text-slate-500 hover:text-violet-400 transition-colors w-fit">
              All games
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600">
            &copy; {currentYear} CrazyArcade. All rights reserved.
          </p>
          <a
            href="mailto:babycreativ@gmail.com"
            className="text-[11px] text-slate-600 hover:text-violet-400 transition-colors"
          >
            babycreativ@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
