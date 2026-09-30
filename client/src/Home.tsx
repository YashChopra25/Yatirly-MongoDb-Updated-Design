import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Link2, QrCode } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Backdrop from "@/components/common/Backdrop";
import Tabs from "./components/urlshortner/Tabs";
import { useAppSelector } from "./store/auth.store";
import { qrPalette } from "@/config/qr";

const word =
  "Create and manage short links and QR codes, then track every visit — browser, device and OS — from one board.";

const stats = [
  { label: "Tools", value: "2", hint: "short links & QR codes" },
  { label: "QR palettes", value: String(qrPalette.length), hint: "plus your own logo" },
  { label: "Export formats", value: "4", hint: "SVG · PNG · JPEG · WEBP" },
  { label: "Analytics", value: "Live", hint: "browser, device & OS" },
];

const steps = [
  {
    icon: Link2,
    title: "Paste a long URL",
    body: "Drop any link into the shortener. We mint a compact, shareable handle in one request.",
    progress: 33,
  },
  {
    icon: QrCode,
    title: "Style a QR code",
    body: "Pick a palette, drop in your logo and export print-ready SVG or PNG files.",
    progress: 66,
  },
  {
    icon: BarChart3,
    title: "Watch clicks land",
    body: "Your dashboard breaks every visit down by month, browser, device and OS.",
    progress: 100,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="relative min-h-screen">
      <Backdrop />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="container pb-10 pt-14 sm:pt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-4xl space-y-6">
            <span className="chip">
              <span className="dot" />
              Welcome, Yatifer · link launchpad
            </span>
            <h1 className="headline text-5xl leading-[0.95] sm:text-7xl lg:text-[88px]">
              Shorten it. Scan it.
              <br />
              <span className="text-accent-ink" style={{ textShadow: "0 0 40px rgb(var(--tp) / 0.35)" }}>
                Track every click.
              </span>
            </h1>
            <TextGenerateEffect words={word} className="max-w-2xl text-lg leading-relaxed sm:text-xl" duration={0.6} />
          </motion.div>

          {/* Stat strip */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="panel px-5 py-4">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="num mt-1 text-3xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Tool board */}
        <section id="tools" className="container scroll-mt-20 pb-20">
          <Tabs />
        </section>

        {/* How it works */}
        <section className="container pb-20">
          <div className="mb-8 space-y-3">
            <span className="eyebrow">
              <span className="dot" /> How it works
            </span>
            <h2 className="headline text-4xl sm:text-5xl">From long link to live signal.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08 }}
                className="panel panel-hover group relative overflow-hidden p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-theme-primary/30 bg-theme-primary/10 text-accent-ink">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="num text-sm text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="num text-accent-ink">{step.progress}%</span>
                </div>
                <div className="progress-track mt-2">
                  <div className="progress-fill" style={{ width: `${step.progress}%` }} />
                </div>
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full border border-border opacity-60 transition-transform duration-500 group-hover:scale-110" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="container pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-theme-primary px-6 py-14 text-theme-primary-foreground sm:px-12 sm:py-20">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(0 0 0 / 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.18) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage: "radial-gradient(ellipse at 70% 50%, black, transparent 75%)",
                WebkitMaskImage: "radial-gradient(ellipse at 70% 50%, black, transparent 75%)",
              }}
            />
            <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:block">
              <div className="flex h-56 w-56 animate-float items-center justify-center rounded-[48px] bg-black/90 shadow-2xl">
                <QrCode className="h-28 w-28 text-theme-primary" strokeWidth={1.4} />
              </div>
            </div>
            <div className="relative max-w-xl space-y-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">Links · QR codes · Analytics</p>
              <h2 className="headline text-4xl sm:text-6xl">Every link deserves a launchpad.</h2>
              <Link
                to={user?.name ? "/dashboard" : "/auth/signup"}
                className="btn h-12 bg-black px-6 text-white hover:bg-black/85"
              >
                {user?.name ? "Open your dashboard" : "Create your account"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
