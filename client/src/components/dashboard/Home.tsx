import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, BarChart3, History, Link2, QrCode } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, TooltipProps } from "recharts";
import React, { useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { getIcon } from "@/utils/general";
import { StatCardProps, analyticsDataTypes, defaultViewType } from "@/Types";
import { useAppSelector } from "@/store/auth.store";
import PageHeader from "@/components/common/PageHeader";

const toNumber = (value: string | number) => Number(value) || 0;

const StatCard: React.FC<StatCardProps & { hint?: string; delay?: number }> = ({
  title,
  value,
  icon: Icon,
  hint,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="panel panel-hover px-5 py-4"
  >
    <div className="flex items-center justify-between text-muted-foreground">
      <p className="truncate text-xs capitalize">{title}</p>
      <Icon className="h-4 w-4 shrink-0" />
    </div>
    <p className="num mt-2 text-3xl font-semibold">{value}</p>
    {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
  </motion.div>
);

const BreakdownPanel = ({ title, rows, total }: { title: string; rows: defaultViewType[]; total: number }) => (
  <div className="panel p-5">
    <p className="eyebrow">{title}</p>
    {rows.length === 0 ? (
      <p className="mt-6 text-sm text-muted-foreground">No visits recorded yet.</p>
    ) : (
      <ul className="mt-5 space-y-4">
        {rows.map((row) => {
          const Icon = getIcon(row.name);
          const views = toNumber(row.views);
          const pct = total > 0 ? Math.round((views / total) * 100) : 0;
          return (
            <li key={row.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 capitalize">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  {row.name}
                </span>
                <span className="num text-muted-foreground">
                  {views.toLocaleString()} · <span className="text-accent-ink">{pct}%</span>
                </span>
              </div>
              <div className="progress-track mt-2">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

const ChartTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="num text-lg font-semibold">
        {payload[0].value?.toLocaleString()} <span className="text-xs text-muted-foreground">visits</span>
      </p>
    </div>
  );
};

const quickActions = [
  { to: "/?tool=link", label: "Create new link", icon: Link2 },
  { to: "/?tool=qr_code", label: "Generate QR code", icon: QrCode },
  { to: "/dashboard?tab=history", label: "View history", icon: History },
];

const Home: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [data, setData] = React.useState<analyticsDataTypes>({
    monthAnalytics: [],
    totalVisits: "",
    browser: [],
    devices: [],
    os: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axiosInstance.get("/api/v1/analytics/fetch");
        if (data.success) {
          setData(data);
        }
      } catch (error) {
        console.error("Failed to load analytics", error);
      }
    }
    fetchData();
  }, []);

  const total = toNumber(data.totalVisits);
  const firstName = user?.name?.split(" ")[0] || "Yatifer";
  const top = (rows: defaultViewType[]) =>
    [...rows].sort((a, b) => toNumber(b.views) - toNumber(a.views))[0];
  const topBrowser = top(data.browser);
  const topDevice = top(data.devices);
  const topOs = top(data.os);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analytics · live"
        title={
          <>
            Welcome back, <span className="capitalize text-accent-ink">{firstName}</span>
          </>
        }
        description="Every visit to your short links and QR codes, broken down as it happens."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard title="Total visits" value={total.toLocaleString()} icon={BarChart3} hint="all links, all time" />
        <StatCard
          title="Top browser"
          value={topBrowser?.name ?? "—"}
          icon={topBrowser ? getIcon(topBrowser.name) : Link2}
          hint={topBrowser ? `${toNumber(topBrowser.views).toLocaleString()} visits` : "no data yet"}
          delay={0.05}
        />
        <StatCard
          title="Top device"
          value={topDevice?.name ?? "—"}
          icon={topDevice ? getIcon(topDevice.name) : Link2}
          hint={topDevice ? `${toNumber(topDevice.views).toLocaleString()} visits` : "no data yet"}
          delay={0.1}
        />
        <StatCard
          title="Top OS"
          value={topOs?.name ?? "—"}
          icon={topOs ? getIcon(topOs.name) : Link2}
          hint={topOs ? `${toNumber(topOs.views).toLocaleString()} visits` : "no data yet"}
          delay={0.15}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="panel p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="eyebrow">Monthly visits</p>
            <p className="num mt-2 text-4xl font-semibold">
              {total.toLocaleString()}
              <span className="ml-2 text-sm font-normal text-muted-foreground">total</span>
            </p>
          </div>
        </div>
        <div className="mt-6 h-[300px] text-muted-foreground">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthAnalytics} margin={{ left: -20, right: 4 }}>
              <defs>
                <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" style={{ stopColor: "rgb(var(--tp))", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "rgb(var(--tp))", stopOpacity: 0.25 }} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgb(var(--border))" strokeDasharray="3 6" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "currentColor", fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "currentColor", fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgb(var(--tp) / 0.08)" }} />
              <Bar dataKey="views" fill="url(#barFill)" radius={[6, 6, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BreakdownPanel title="Browsers" rows={data.browser} total={total} />
        <BreakdownPanel title="Devices" rows={data.devices} total={total} />
        <BreakdownPanel title="Operating systems" rows={data.os} total={total} />
      </div>

      <div>
        <p className="eyebrow mb-3">Quick actions</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="panel panel-hover group flex items-center gap-3 p-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-theme-primary/30 bg-theme-primary/10 text-accent-ink">
                <action.icon className="h-[18px] w-[18px]" />
              </span>
              <span className="font-medium">{action.label}</span>
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
