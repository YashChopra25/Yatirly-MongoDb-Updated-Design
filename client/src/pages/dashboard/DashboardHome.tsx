import Navigation from "@/components/dashboard/Navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { useLocation, useNavigate } from "react-router-dom"; // useLocation and useNavigate hooks
import { items } from "@/utils/NavbarOptions";
import axiosInstance from "@/api/axiosInstance";
import ToastFn from "@/components/Toaster";

const DashboardHome = () => {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // For navigating programmatically

  // Read the query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "home"; // Default to 'home' if no tab in URL

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync the active tab with the URL whenever it changes
  useEffect(() => {
    // Update the query parameter in the URL when the active tab changes
    navigate(
      {
        pathname: location.pathname,
        search: `?tab=${activeTab}`,
      },
      { replace: true }
    ); // replace: true to avoid pushing a new history entry
  }, [activeTab, location.pathname, navigate]);

  // Function to handle tab click and update state
  const handleTabClick = async (query: string) => {
    try {
      if (query === "logout") {
        const { data } = await axiosInstance.get("/api/v1/auth/user/logout");
        if (!data.success) {
          ToastFn("error", "Error", data.message);
          return;
        }
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Error updating active tab:", error);
    } finally {
      setActiveTab(query); // Update the state with the clicked tab's query
    }
  };

  return (
    <SidebarProvider className="bg-[#25293c] text-[#cfcde4]">
      <Sidebar>
        <SidebarContent className="bg-[#25293c] text-[#cfcde4]">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xl font-semibold text-[#cfcde4]">
              Yatirly
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <Navigation handlerClick={handleTabClick} activeTab={activeTab} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger className="absolute md:hidden" size={"icon"} />
      <main className="px-5 py-2 w-full max-md:mt-4">
        {/* SidebarTrigger can be added if you need it for toggling */}
        {items.map((item) => {
          if (item.query === activeTab) {
            return <div key={item.query}>{item.component}</div>;
          }
        })}
      </main>
    </SidebarProvider>
  );
};

export default DashboardHome;
