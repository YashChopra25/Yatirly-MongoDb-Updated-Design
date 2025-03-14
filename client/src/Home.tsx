// import { WavyBackground } from "@/components/ui/wavy-background";

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Navbar from "@/components/common/Navbar";
import Tabs from "./components/urlshortner/Tabs";
import "@/App.css";

const word =
  "With Yatirly Connections Platform, you can easily create and manage URL shorteners, QR codes, and landing pages to connect with your audience. Effortlessly build, customize, and track your content all in one place.";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Main Content */}
          <div className="space-y-8 text-center">
            {/* Animated Gradient Badge */}
            <div className="inline-block animate-fade-in">
              <div className="px-4 py-1 rounded-full bg-theme-primary/20 border border-theme-primary/30 backdrop-blur-sm">
                <span className="text-sm font-medium text-theme-primary">
                  ✨ Your Digital Connection Hub
                </span>
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-4">
              <h1 className="text-6xl font-bold theme-text-gradient inter-var max-md:text-4xl">
                Welcome Yatifer
              </h1>
              <p className="text-3xl font-bold theme-text-gradient max-md:text-xl">
                Build stronger digital connections
              </p>
            </div>

            {/* Text Generate Effect with enhanced styling */}
            <div className="relative">
              <div className="absolute inset-0 bg-theme-primary/10 blur-3xl"></div>
              <TextGenerateEffect
                words={word}
                className="relative text-lg max-w-3xl mx-auto leading-relaxed text-center"
                filter={false}
                duration={5}
              />
            </div>
          </div>

          {/* Tabs Section with enhanced container */}
          <div className="mt-12 rounded-2xl backdrop-blur-sm">
            <Tabs />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-theme-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-theme-primary/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Home;
