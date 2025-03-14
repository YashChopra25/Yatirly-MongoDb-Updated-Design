import { BsAndroid } from "react-icons/bs";
import {
    FaLink,
    FaQrcode,
    FaClock,
    FaChartLine,
    FaChrome,
    FaWindows,
    FaMobile,
} from "react-icons/fa6";
import { IconType } from "react-icons/lib";

// Updated getIcon function with a fallback icon (FaLink)
export const getIcon = (name: string): IconType => {
    const changedName = name.toLowerCase().trim(); // Normalize input

    // Icon map where the key is the name of the icon
    const icons: { [key: string]: IconType } = {
        link: FaLink,
        qrcode: FaQrcode,
        clock: FaClock,
        chart: FaChartLine,
        chrome: FaChrome,
        windows: FaWindows,
        mobile: FaMobile,
        android: BsAndroid,
        "mobile chrome": FaChrome,
    };

    // Return the icon based on the name or a fallback icon (FaLink) if not found
    return icons[changedName] || FaLink;
};
