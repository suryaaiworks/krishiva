import { 
  Home, Bot, Sprout, CloudSun, IndianRupee, Bug, Leaf, 
  Landmark, Tractor, Handshake, ShieldAlert, MapPinned, 
  Bell, UserRound, Settings, CircleHelp 
} from "lucide-react";
import { ElementType } from "react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: ElementType;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "AI Advisor (Vira)", href: "/assistant", icon: Bot },
  { label: "My Crops", href: "/crops", icon: Sprout },
  { label: "Weather Intelligence", href: "/weather", icon: CloudSun },
  { label: "Market Prices", href: "/market", icon: IndianRupee },
  { label: "Disease Detection", href: "/disease", icon: Bug },
  { label: "Fertilizer Advisor", href: "/fertilizer", icon: Leaf },
  { label: "Government Schemes", href: "/schemes", icon: Landmark },
  { label: "Machinery Rental", href: "/machinery", icon: Tractor },
  { label: "Buyer Marketplace", href: "/marketplace", icon: Handshake },
  { label: "Relief Hub", href: "/relief", icon: ShieldAlert },
  { label: "Nearby Offices", href: "/offices", icon: MapPinned },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help & Support", href: "/help", icon: CircleHelp }
];
