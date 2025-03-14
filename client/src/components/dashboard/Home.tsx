import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaLink,
  FaQrcode,
  FaClock,
  FaChartLine,
} from "react-icons/fa6";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React, { useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { getIcon } from "@/utils/general";
import { StatCardProps, analyticsDataTypes } from "@/Types";



const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card/50 backdrop-blur-sm rounded-2xl border border-white/20  p-6"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-theme-primary/60">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${className}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </motion.div>
);

const Home: React.FC = () => {
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
      } catch (error) {}
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 backdrop-blur-sm rounded-2xl border  border-white/20 p-6"
      >
        <h2 className="text-2xl font-bold theme-text-gradient mb-2">
          Welcome back, Yatifer! 👋
        </h2>
        <p className="text-theme-primary/60">Here's your analytics overview.</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Visits"
          value={data.totalVisits || 0}
          icon={FaChartLine}
          className="bg-blue-500/10 text-blue-500"
        />
        {data.browser.length > 0 &&
          data.browser.map((item) => {
            const Icon = getIcon(item.name) || FaLink; // Fallback to FaLink
            return (
              <StatCard
                key={item.name}
                title={item.name}
                value={item.views}
                icon={Icon}
                className="bg-yellow-500/10 text-yellow-500"
              />
            );
          })}
        {data.devices.length > 0 &&
          data.devices.map((item) => {
            const Icon = getIcon(item.name) || FaLink; // Fallback to FaLink
            return (
              <StatCard
                key={item.name}
                title={item.name}
                value={item.views}
                icon={Icon}
                className="bg-green-500/10 text-green-500"
              />
            );
          })}
        {data.os.length > 0 &&
          data.os.map((item) => {
            const Icon = getIcon(item.name) || FaLink; // Fallback to FaLink
            return (
              <StatCard
                key={item.name}
                title={item.name}
                value={item.views}
                icon={Icon}
                className="bg-red-500/10 text-red-500"
              />
            );
          })}
      </div>

      {/* Monthly Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/50 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
      >
        <h3 className="text-lg font-semibold mb-6">Monthly Visits</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthAnalytics}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar
                dataKey="views"
                fill="var(--theme-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/?tool=link"
            className="flex items-center gap-3 p-4 rounded-xl bg-theme-primary/5 hover:bg-theme-primary/10 border border-theme-primary/20 transition-all duration-300"
          >
            <FaLink className="w-5 h-5 text-theme-primary" />
            <span className="font-medium">Create New Link</span>
          </Link>
          <Link
            to="/?tool=qr_code"
            className="flex items-center gap-3 p-4 rounded-xl bg-theme-primary/5 hover:bg-theme-primary/10 border border-theme-primary/20 transition-all duration-300"
          >
            <FaQrcode className="w-5 h-5 text-theme-primary" />
            <span className="font-medium">Generate QR Code</span>
          </Link>
          <Link
            to="/dashboard?tab=history"
            className="flex items-center gap-3 p-4 rounded-xl bg-theme-primary/5 hover:bg-theme-primary/10 border border-theme-primary/20 transition-all duration-300"
          >
            <FaClock className="w-5 h-5 text-theme-primary" />
            <span className="font-medium">View History</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
