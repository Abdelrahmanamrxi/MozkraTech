import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../middleware/api";

function normalizeSession(session, index) {
  return {
    ...session,
    id: session._id ?? session.id ?? `${index}`,
    duration: Number(session.duration ?? 0),
    startTime: session.startTime ? new Date(session.startTime) : null,
    endTime: session.endTime ? new Date(session.endTime) : null,
  };
}

export function useTimerSessions() {
  const [sessionOverrides, setSessionOverrides] = useState({});
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const focusRunRef = useRef({ startedAt: null });

  const { data: querySessions, isLoading, error } = useQuery({
    queryKey: ["timer-sessions"],
    queryFn: async () => {
      const response = await api.get("/sessions");
      return response.data;
    },
    select: (data) => {
      const list = Array.isArray(data?.sessions) ? data.sessions : [];
      return list
        .map(normalizeSession)
        .sort((left, right) => {
          const leftTime = left.startTime ? new Date(left.startTime).getTime() : 0;
          const rightTime = right.startTime ? new Date(right.startTime).getTime() : 0;
          return leftTime - rightTime;
        });
    },
   refetchOnMount: true,
   refetchOnReconnect: true,
    retry: 1,
  });

  const sessions = useMemo(() => {
    const baseSessions = Array.isArray(querySessions) ? querySessions : [];

    return baseSessions
      .map((session) => {
        const override = sessionOverrides[String(session.id)];
        return override ? { ...session, ...override } : session;
      })
      .sort((left, right) => {
        const leftTime = left.startTime ? new Date(left.startTime).getTime() : 0;
        const rightTime = right.startTime ? new Date(right.startTime).getTime() : 0;
        return leftTime - rightTime;
      });
  }, [querySessions, sessionOverrides]);

  const resolvedSelectedSessionId = useMemo(() => {
    if (!sessions.length) return "";

    const currentSelectedId = String(selectedSessionId || "");
    const stillExists = sessions.some(
      (session) => String(session.id) === currentSelectedId
    );

    return currentSelectedId && stillExists
      ? currentSelectedId
      : String(sessions[0].id);
  }, [sessions, selectedSessionId]);

  const selectedSession = useMemo(
    () => sessions.find((session) => String(session.id) === resolvedSelectedSessionId) ?? null,
    [resolvedSelectedSessionId, sessions]
  );

  const updateSessionLocally = (sessionId, updatedSession) => {
    if (!sessionId || !updatedSession) return;

    setSessionOverrides((prevOverrides) => ({
      ...prevOverrides,
      [String(sessionId)]: {
        ...prevOverrides[String(sessionId)],
        ...updatedSession,
        id: updatedSession._id ?? updatedSession.id ?? sessionId,
      },
    }));
  };

  const beginFocusRun = () => {
    if (!focusRunRef.current.startedAt) {
      
      focusRunRef.current.startedAt = Date.now();
    }
  };

  const consumeFocusRun = () => {
    const startedAt = focusRunRef.current.startedAt;
    if (!startedAt) {
     
      return 0;
    }

    const elapsedMinutes = (Date.now() - startedAt) / 60000;

    focusRunRef.current.startedAt = null;
    return elapsedMinutes;
  };

  const clearFocusRun = () => {
    focusRunRef.current.startedAt = null;
  };

  return {
    sessions,
    selectedSession,
    selectedSessionId: resolvedSelectedSessionId,
    setSelectedSessionId,
    updateSessionLocally,
    beginFocusRun,
    consumeFocusRun,
    clearFocusRun,
    isLoading,
    error,
  };
}