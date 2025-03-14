import Home from "@/components/dashboard/Home";
import Profile from "@/components/dashboard/Profile";
import Setting from "@/components/dashboard/Setting";
import TableComponent from "@/components/dashboard/TableComponent";
import { Calendar, HomeIcon, User, Settings} from "lucide-react";

export const items = [
  {
    url: "/home",
    query: "home",
    icon: HomeIcon,
    component: <Home />,
  },
  {
    url: "/history",
    query: "history",
    icon: Calendar,
    component: (
      <div className="mt-2">
      
        <TableComponent />
      </div>
    ),
  },
  {
    url: "/profile",
    query: "profile",
    icon: User,
    component: <Profile />,
  },
  {
    url: "/setting",
    query: "settings",
    icon: Settings,
    component: <Setting />,
  },
];
