import { Home, Sparkles, CloudSun, TrendingUp, HeartHandshake, User, MapPin } from "lucide-react";
import { ElementType } from "react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: ElementType;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "AI Advisor",
    href: "/assistant",
    icon: Sparkles,
  },
  {
    label: "Weather",
    href: "/weather",
    icon: CloudSun,
  },
  {
    label: "Market",
    href: "/market",
    icon: TrendingUp,
  },
  {
    label: "Relief Hub",
    href: "/relief",
    icon: HeartHandshake,
  },
  {
    label: "Offices",
    href: "/offices",
    icon: MapPin,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

