import { Palette } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";

const Setting = () => (
  <div className="space-y-8">
    <PageHeader eyebrow="Preferences" title="Settings" description="Tune how Yatirly looks and behaves for you." />

    <div className="panel flex flex-wrap items-center justify-between gap-4 p-6">
      <div className="flex items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-theme-primary/30 bg-theme-primary/10 text-accent-ink">
          <Palette className="h-[18px] w-[18px]" />
        </span>
        <div>
          <p className="font-semibold">Appearance</p>
          <p className="text-sm text-muted-foreground">Choose an accent color and switch between dark and light.</p>
        </div>
      </div>
      <ThemeSwitcher />
    </div>

    <p className="text-sm text-muted-foreground">More settings are on the way.</p>
  </div>
);

export default Setting;
