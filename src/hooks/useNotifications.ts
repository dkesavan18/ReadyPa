"use client";

import { useEffect, useState } from "react";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  };

  const sendNotification = (title: string, body: string, icon = "/icon-192x192.png") => {
    if (!isSupported || permission !== "granted") return;
    new Notification(title, { body, icon });
  };

  return { permission, isSupported, requestPermission, sendNotification };
}
