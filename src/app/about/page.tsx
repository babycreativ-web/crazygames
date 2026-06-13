import type { Metadata } from "next";
import { Gamepad2, Heart, Users, Shield, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About - CrazyArcade",
  description: "Learn about CrazyArcade, the free online gaming platform with thousands of HTML5 games playable directly in your browser.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold text-slate-100 md:text-4xl tracking-tight mb-6">
        About CrazyArcade
      </h1>

      <div className="flex flex-col gap-8 text-slate-400 text-sm leading-relaxed">
        <p className="text-base text-slate-300">
          CrazyArcade is a free online gaming platform where you can play thousands of HTML5 games 
          directly in your browser — no downloads, no installs, no hassle. Whether you&apos;re into action, 
          puzzles, racing, or strategy, we&apos;ve got something for everyone.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-3 items-start rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-1">Free to Play</h3>
              <p className="text-xs text-slate-500">All games on CrazyArcade are completely free. Jump in and start playing instantly.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-600/20 text-pink-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-1">Play Anywhere</h3>
              <p className="text-xs text-slate-500">Works on desktop, tablet, and mobile browsers. No app download needed.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-1">Safe & Secure</h3>
              <p className="text-xs text-slate-500">We care about your safety. All games are vetted and run in a secure environment.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600/20 text-amber-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-1">For Everyone</h3>
              <p className="text-xs text-slate-500">From kids to adults, casual gamers to hardcore players — there&apos;s a game for you.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-200 mb-3">Our Mission</h2>
          <p>
            We believe gaming should be accessible to everyone. Our mission is to provide a curated library 
            of high-quality browser games that are fun, safe, and free. We partner with talented game developers 
            from around the world to bring you the best gaming experiences.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-200 mb-3">Contact Us</h2>
          <p>
            Have questions, feedback, or a game you&apos;d like to see on our platform? Reach out to us at{" "}
            <a href="mailto:babycreativ@gmail.com" className="text-violet-400 hover:text-pink-400 transition-colors font-medium">
              babycreativ@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
