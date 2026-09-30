import { LogoMark } from "./Logo";

/** Pulsing logo with orbit rings, shared by the loading and redirect screens. */
const SignalLoader = () => (
  <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
    <span className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-theme-primary/30" />
    <span className="absolute inset-6 animate-ping-slow rounded-full border border-theme-primary/40" />
    <span className="absolute inset-10 rounded-full border border-border" />
    <LogoMark className="h-14 w-14 rounded-2xl" />
  </div>
);

export default SignalLoader;
