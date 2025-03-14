interface ApiResponseCreateLink {
    id: number,
    ownerId?: number,
    longURL: string,
    ShortURL: string,
    createdAt: string,
    updatedAt: string
}
interface NavigationTypes {
    handlerClick: (query: string) => void
    activeTab: string
}
interface userFieldProfile {
    first_name: string,
    last_name: string,
    email: string
}

type ResponseTypeHistory = {
    id: string;
    ownerId: string;
    longURL: string;
    ShortURL: string;
    createdAt: string;
    _count: {
        visits: number;
    };
    owner: {
        id: string;
        name: string;
        email: string;
    };
};
interface MonthlyData {
    name: string;
    views: number;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    className?: string;
}
interface defaultViewType {
    name: string;
    views: string;
}
interface analyticsDataTypes {
    monthAnalytics: MonthlyData[];
    totalVisits: string;
    browser: defaultViewType[];
    devices: defaultViewType[];
    os: defaultViewType[];
}

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
}
export type {
    userFieldProfile,
    ApiResponseCreateLink,
    NavigationTypes,
    ResponseTypeHistory,
    MonthlyData,
    StatCardProps,
    defaultViewType,
    analyticsDataTypes,
    UserProfile
}