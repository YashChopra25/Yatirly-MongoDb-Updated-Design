import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => (
  <footer className="border-t border-border/70">
    <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
      <div className="space-y-4">
        <Logo />
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Short links, loud results.</span> Shorten URLs,
          design QR codes and watch every click roll in — all from one board.
        </p>
      </div>
      <div className="space-y-3">
        <p className="eyebrow">Tools</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link className="hover:text-foreground" to="/?tool=link">URL shortener</Link></li>
          <li><Link className="hover:text-foreground" to="/?tool=qr_code">QR code studio</Link></li>
          <li><Link className="hover:text-foreground" to="/dashboard?tab=home">Analytics</Link></li>
        </ul>
      </div>
      <div className="space-y-3">
        <p className="eyebrow">Account</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link className="hover:text-foreground" to="/auth/signup">Create account</Link></li>
          <li><Link className="hover:text-foreground" to="/auth/login">Log in</Link></li>
          <li><Link className="hover:text-foreground" to="/dashboard?tab=history">Link history</Link></li>
        </ul>
      </div>
    </div>
    <div className="container flex flex-wrap items-center justify-between gap-2 border-t border-border/70 py-5 font-mono text-xs text-muted-foreground">
      <span>© {new Date().getFullYear()} Yatirly</span>
      <span>
        Built by{" "}
        <a href="https://yashchopra.tech/" target="_blank" rel="noopener noreferrer" className="text-accent-ink hover:underline">
          Yash Chopra ↗
        </a>
      </span>
    </div>
  </footer>
);

export default Footer;
