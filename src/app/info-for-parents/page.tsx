import type { Metadata } from "next";
import { Shield, Eye, Clock, MessageCircle, Gamepad2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Info for Parents - CrazyArcade",
  description: "Information for parents about CrazyArcade. Learn how we keep kids safe while gaming online.",
};

export default function InfoForParentsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold text-slate-100 md:text-4xl tracking-tight mb-6">
        Info for Parents
      </h1>

      <div className="flex flex-col gap-8 text-sm text-slate-400 leading-relaxed">
        <p className="text-base text-slate-300">
          At CrazyArcade, we believe that gaming should be a fun and safe experience for everyone, 
          especially children. Here&apos;s everything you need to know about our platform and how we 
          keep young gamers safe.
        </p>

        {/* Safety Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-3 items-start rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-1">Safe Content</h3>
              <p className="text-xs text-slate-500">All games are reviewed to ensure they are appropriate for a general audience.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-1">No Hidden Costs</h3>
              <p className="text-xs text-slate-500">All games are 100% free to play. No in-app purchases or credit card required.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600/20 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-1">No Downloads</h3>
              <p className="text-xs text-slate-500">Games run directly in the browser. No software installation needed on your device.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-1">No Chat Features</h3>
              <p className="text-xs text-slate-500">There are no chat rooms or messaging features, reducing the risk of online contact.</p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-slate-200 mb-3">What kind of games do we offer?</h2>
          <p>
            CrazyArcade hosts a wide variety of HTML5 browser games across many categories including 
            action, adventure, puzzle, racing, sports, and educational games. All games are selected to be 
            family-friendly and appropriate for a general audience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-200 mb-3">Tips for Parents</h2>
          <ul className="list-disc list-inside flex flex-col gap-2 text-slate-500">
            <li>Set reasonable time limits for gaming sessions</li>
            <li>Explore and play games together with your children</li>
            <li>Use your browser&apos;s parental controls if needed</li>
            <li>Talk to your children about online safety and responsible gaming</li>
            <li>Encourage a healthy balance between screen time and other activities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-200 mb-3">Advertising</h2>
          <p>
            CrazyArcade is a free platform supported by advertising. While we strive to ensure ads are 
            appropriate, we recommend using ad-blocking software if you prefer an ad-free experience for 
            your children. We work with reputable ad networks that comply with children&apos;s advertising 
            guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-200 mb-3">Contact Us</h2>
          <p>
            If you have any concerns about content on our platform or questions about child safety, 
            please don&apos;t hesitate to contact us at{" "}
            <a href="mailto:babycreativ@gmail.com" className="text-violet-400 hover:text-pink-400 transition-colors font-medium">
              babycreativ@gmail.com
            </a>
            . We take all parent feedback seriously and respond promptly.
          </p>
        </section>
      </div>
    </div>
  );
}
