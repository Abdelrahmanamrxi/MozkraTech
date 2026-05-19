import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../middleware/api";

const POLL_INTERVAL_MS = 2500;

async function fetchUnreadCount() {
  const response = await api.get("/notifications/unread-count");
  return response.data;
}

async function fetchNotifications(filter, page) {
  const response = await api.get("/notifications", {
    params: { filter, page },
  });
  return response.data;
}

async function markNotificationsRead() {
  const response = await api.patch("/notifications/mark-read");
  return response.data;
}

export function useNotificationUnreadCount(enabled = true) {
  const { data } = useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: fetchUnreadCount,
    enabled,
    refetchInterval: enabled ? POLL_INTERVAL_MS : false,
    retry: 1,
  });

  return data?.unreadCount ?? 0;
}

export function useNotificationsList({
  filter = "all",
  page = 1,
  isOpen = false,
}) {
  return useQuery({
    queryKey: ["notifications", "list", filter, page],
    queryFn: () => fetchNotifications(filter, page),
    enabled: isOpen,
    refetchInterval: isOpen ? POLL_INTERVAL_MS : false,
    retry: 1,
  });
}

export function useMarkNotificationsReadOnOpen(isOpen) {
  const queryClient = useQueryClient();
  const hasMarkedRef = useRef(false);

  const mutation = useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    if (!isOpen) {
      hasMarkedRef.current = false;
      return;
    }
    if (hasMarkedRef.current) return;
    hasMarkedRef.current = true;
    mutation.mutate();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return mutation;
}
