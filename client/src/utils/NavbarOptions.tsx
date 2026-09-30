import Home from "@/components/dashboard/Home";
import Profile from "@/components/dashboard/Profile";
import Setting from "@/components/dashboard/Setting";
import TableComponent from "@/components/dashboard/TableComponent";
import { History, LayoutGrid, User, Settings } from "lucide-react";

export const items = [
  {
    url: "/home",
    query: "home",
    title: "Overview",
    icon: LayoutGrid,
    component: <Home />,
  },
  {
    url: "/history",
    query: "history",
    title: "Link history",
    icon: History,
    component: <TableComponent />,
  },
  {
    url: "/profile",
    query: "profile",
    title: "Profile",
    icon: User,
    component: <Profile />,
  },
  {
    url: "/setting",
    query: "settings",
    title: "Settings",
    icon: Settings,
    component: <Setting />,
  },
];
