"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Bell, AlertTriangle, Info, Check, Trash2, Search, 
  WifiOff, ArrowLeft, Calendar, RefreshCw, Loader2
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/services/apiClient";
import { useLanguage } from "@/context/LanguageContext";

interface Notification {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  date: string;
  read: boolean;
  category: "weather" | "pest" | "market" | "scheme" | "relief";
  actionLabel?: string;
  actionHref?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isPageLoading, setIsPageLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [filter, setFilter] = React.useState<"all" | "critical" | "warning" | "info">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);


  const INITIAL_NOTIFICATIONS: Notification[] = React.useMemo(() => [
    {
      id: "1",
      type: "critical",
      title: t("Dry Spell Warning - Action Needed"),
      message: t("Zero precipitation is forecasted for the next 5 consecutive days starting tomorrow. Drip irrigate Sugarcane Zone B today to prevent moisture stress."),
      date: t("Just now"),
      read: false,
      category: "weather",
      actionLabel: t("Irrigation Guide"),
      actionHref: "/weather"
    },
    {
      id: "2",
      type: "warning",
      title: t("Sugarcane Stem Borer Alert"),
      message: t("Local humidity and temperature profiles indicate high risk of stem borer propagation. Inspect lower stalks for entry tunnels."),
      date: t("3 hours ago"),
      read: false,
      category: "pest",
      actionLabel: t("Foliage Scan"),
      actionHref: "/disease"
    },
    {
      id: "3",
      type: "info",
      title: t("PM-Kisan Subsidy Verification Needed"),
      message: t("Your application for the PM-Kisan micro-irrigation subsidy matches 98% eligibility. Upload your land ownership certificate to complete approval."),
      date: t("1 day ago"),
      read: true,
      category: "scheme",
      actionLabel: t("Verify Subsidies"),
      actionHref: "/schemes"
    },
    {
      id: "4",
      type: "info",
      title: t("Sugarcane Price Increase (+3.6%)"),
      message: t("Sugarcane Grade A wholesale bids surged by ₹120/Quintal at Pune APMC Mandi. Buyers are actively quoting higher rates."),
      date: t("2 days ago"),
      read: true,
      category: "market",
      actionLabel: t("Market Center"),
      actionHref: "/market"
    },
    {
      id: "5",
      type: "critical",
      title: t("Disaster Relief Allocation Approved"),
      message: t("Emergency crop compensation of ₹24,000 has been pre-approved for your registered flood plot. Select alternative buyers to sell residue."),
      date: t("3 days ago"),
      read: true,
      category: "relief",
      actionLabel: t("Relief Hub"),
      actionHref: "/relief"
    }
  ], [t]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const list = await apiClient.get<any[]>("/notifications");
      if (list && list.length > 0) {
        setNotifications(list.map((n: any) => ({
          id: n.id,
          type: n.type,
          title: t(n.title),
          message: t(n.message),
          date: t(n.date),
          read: n.read,
          category: n.category,
          actionLabel: n.actionLabel ? t(n.actionLabel) : undefined,
          actionHref: n.actionHref
        })));
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } catch (err) {
      console.warn("Failed to load backend notifications, using fallback list.", err);
      setNotifications(INITIAL_NOTIFICATIONS);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadNotifications();
  }, [INITIAL_NOTIFICATIONS]);

  if (isPageLoading) {
    return (
      <MainLayout>
        <div className="space-y-8 pb-16 text-left animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1/4 bg-muted/40 animate-pulse rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-10 w-full bg-muted/40 animate-pulse rounded-[12px] border border-border" />
            <div className="h-28 w-full bg-muted/40 animate-pulse rounded-[24px] border border-border" />
            <div className="h-28 w-full bg-muted/40 animate-pulse rounded-[24px] border border-border" />
            <div className="h-28 w-full bg-muted/40 animate-pulse rounded-[24px] border border-border" />
          </div>
        </div>
      </MainLayout>
    );
  }

  const toggleRead = async (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    setNotifications(updated);
    try {
      await apiClient.patch(`/notifications/${id}`, { read: !notifications.find(n => n.id === id)?.read });
    } catch (err) {
      console.warn("Failed to update notification read state on server.", err);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await apiClient.post("/notifications/read-all", {});
    } catch (err) {
      console.warn("Failed to mark all notifications read on server.", err);
    }
  };

  const handleDelete = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch (err) {
      console.warn("Failed to delete notification on server.", err);
    }
  };

  const handleClearAll = async () => {
    setNotifications([]);
    try {
      await apiClient.delete("/notifications/clear-all");
    } catch (err) {
      console.warn("Failed to clear notifications on server.", err);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === "all" || notif.type === filter;
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-16 text-left">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted border border-border cursor-pointer"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                {t("Notifications")} <Bell className="h-5 w-5 text-primary" />
              </h1>
              <p className="text-xs text-muted-foreground">
                {t("Stay updated with emergency weather anomalies, crop pest propagation alerts, and B2B pricing bids.")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-end">
            <Button
              variant="outline"
              size="sm"
              onClick={loadNotifications}
              disabled={isLoading}
              className="h-9 rounded-btn text-xs font-bold bg-card border-border cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              )}
              {t("Sync")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOffline(prev => !prev)}
              className={`h-9 rounded-btn text-xs font-bold border-border cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] hover:shadow-md ${isOffline ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-sm animate-pulse" : "bg-card"}`}
            >
              <WifiOff className="h-3.5 w-3.5 mr-1.5" />
              {isOffline ? t("Go Online") : t("Simulate Offline")}
            </Button>
          </div>
        </div>

        {/* Search bar and Filters */}
        <div className="flex flex-col gap-4 bg-card p-4 rounded-card border border-border/80 shadow-sm">
          {/* Search Box */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t("Search notifications...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-9.5 pr-4 py-2.5 border border-border rounded-input text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground text-foreground transition-all duration-200"
            />
          </div>

          {/* Filters Selectors wrapped */}
          <div className="flex flex-wrap gap-1.5 py-1">
            {(["all", "critical", "warning", "info"] as const).map((type) => (
              <Button
                key={type}
                size="sm"
                onClick={() => setFilter(type)}
                className={`h-8 px-3.5 text-[10px] font-bold rounded-btn cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                  filter === type 
                    ? "bg-primary text-white shadow-md" 
                    : "bg-muted text-muted-foreground hover:bg-muted/85 hover:shadow-sm"
                }`}
              >
                {t(type.charAt(0).toUpperCase() + type.slice(1))}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Actions */}
        {notifications.length > 0 && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">
              {notifications.filter(n => !n.read).length} {t("unread updates")}
            </span>
            <div className="flex gap-4">
              <button onClick={handleMarkAllRead} className="text-primary font-bold hover:underline cursor-pointer">
                {t("Mark all as read")}
              </button>
              <button onClick={handleClearAll} className="text-rose-500 font-bold hover:underline cursor-pointer flex items-center gap-1">
                <Trash2 className="h-3.5 w-3.5" /> {t("Clear All")}
              </button>
            </div>
          </div>
        )}

        {/* Main List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isOffline ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-12"
              >
                <div className="text-center space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                    <WifiOff className="h-6 w-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-heading text-lg font-bold text-foreground">{t("You are Offline")}</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      {t("Could not fetch fresh alert updates. Caching previously stored alerts offline.")}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setIsOffline(false)} className="rounded-btn bg-primary text-white text-xs font-bold cursor-pointer">
                    {t("Reconnect Now")}
                  </Button>
                </div>
              </motion.div>
            ) : isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-28 bg-card border border-border animate-pulse rounded-card" />
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 text-center space-y-3"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bell className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-lg font-bold text-foreground">{t("No Notifications")}</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    {searchQuery ? t("No matching alerts found for your search criteria.") : t("All clear! You are fully caught up with your farm alerts.")}
                  </p>
                </div>
              </motion.div>
            ) : (
              filteredNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`relative overflow-hidden rounded-card border bg-card p-5 transition-all duration-300 kv-card-hover ${!notif.read ? "border-primary/20 bg-emerald-500/5 shadow-md" : "border-border/80"}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Severity Icon Indicator */}
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      notif.type === "critical" ? "bg-rose-500/10 text-rose-500" :
                      notif.type === "warning" ? "bg-amber-500/10 text-amber-500" :
                      "bg-blue-500/10 text-blue-500"
                    }`}>
                      {notif.type === "critical" && <AlertTriangle className="h-4.5 w-4.5" />}
                      {notif.type === "warning" && <AlertTriangle className="h-4.5 w-4.5" />}
                      {notif.type === "info" && <Info className="h-4.5 w-4.5" />}
                    </div>

                    {/* Text block */}
                    <div className="flex-1 space-y-1.5 text-xs text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <span className="font-bold text-foreground text-sm leading-tight">
                          {notif.title}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {notif.date}
                          </span>
                          {!notif.read && (
                            <Badge className="bg-primary text-white text-[8px] font-bold uppercase tracking-wider py-0.5 px-1.5 border-none">
                              {t("New")}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-xs">
                        {notif.message}
                      </p>

                      {/* CTAs and read markers */}
                      <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between">
                        <div className="flex gap-2">
                          {notif.actionLabel && notif.actionHref && (
                            <Button
                              size="sm"
                              onClick={() => router.push(notif.actionHref!)}
                              className="h-8 rounded-btn bg-primary text-white text-[10px] font-bold cursor-pointer"
                            >
                              {notif.actionLabel}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRead(notif.id)}
                            className="h-8 rounded-btn text-[10px] font-bold hover:bg-muted text-muted-foreground"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            {notif.read ? t("Mark Unread") : t("Mark Read")}
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(notif.id)}
                          className="h-8 w-8 rounded-full text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </div>
    </MainLayout>
  );
}
