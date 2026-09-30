import SignalLoader from "@/components/common/SignalLoader";
import Backdrop from "@/components/common/Backdrop";

const LoadingScreen = () => (
  <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
    <Backdrop streaks={false} />
    <SignalLoader />
    <div className="space-y-2">
      <p className="headline text-2xl">Yatirly</p>
      <p className="eyebrow justify-center">
        <span className="dot" /> Syncing your session
      </p>
    </div>
    <div className="progress-track w-48">
      <div className="progress-fill w-1/2 animate-shimmer" />
    </div>
  </div>
);

export default LoadingScreen;
