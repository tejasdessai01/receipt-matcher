"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Plus,
  Clock,
  Trash2,
  LogOut,
  ChevronLeft,
  FileCheck,
  User,
} from "lucide-react";

interface SessionItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  receiptCount: number;
  transactionCount: number;
  matchedCount: number;
  avgConfidence: number;
}

interface SidebarProps {
  activeSessionId: string | null;
  onNewSession: () => void;
  onLoadSession: (id: string) => void;
  refreshKey: number;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function groupByDate(
  sessions: SessionItem[]
): { label: string; sessions: SessionItem[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const lastWeek = new Date(today.getTime() - 7 * 86400000);

  const groups: { label: string; sessions: SessionItem[] }[] = [
    { label: "Today", sessions: [] },
    { label: "Yesterday", sessions: [] },
    { label: "This week", sessions: [] },
    { label: "Older", sessions: [] },
  ];

  for (const s of sessions) {
    const d = new Date(s.updatedAt);
    if (d >= today) groups[0].sessions.push(s);
    else if (d >= yesterday) groups[1].sessions.push(s);
    else if (d >= lastWeek) groups[2].sessions.push(s);
    else groups[3].sessions.push(s);
  }

  return groups.filter((g) => g.sessions.length > 0);
}

export default function Sidebar({
  activeSessionId,
  onNewSession,
  onLoadSession,
  refreshKey,
}: SidebarProps) {
  const { data: authSession } = useSession();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
      })
      .catch(() => {});
  }, [refreshKey]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) onNewSession();
    } finally {
      setDeletingId(null);
    }
  };

  const grouped = groupByDate(sessions);

  if (collapsed) {
    return (
      <div className="flex h-full w-14 flex-col items-center border-r border-gray-200 bg-white py-4">
        <button
          onClick={() => setCollapsed(false)}
          className="mb-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          title="Expand sidebar"
        >
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </button>
        <button
          onClick={onNewSession}
          className="mb-2 rounded-lg bg-indigo-50 p-2 text-indigo-600 hover:bg-indigo-100 transition"
          title="New session"
        >
          <Plus className="h-5 w-5" />
        </button>
        <div className="mt-2 space-y-1">
          {sessions.slice(0, 8).map((s) => (
            <button
              key={s.id}
              onClick={() => onLoadSession(s.id)}
              className={`rounded-lg p-2 transition ${
                s.id === activeSessionId
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              }`}
              title={s.name}
            >
              <FileCheck className="h-4 w-4" />
            </button>
          ))}
        </div>
        <div className="mt-auto">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-72 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
            <svg
              className="h-4 w-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4" />
              <rect x="3" y="3" width="18" height="18" rx="3" />
            </svg>
          </div>
          <span className="truncate text-sm font-bold text-gray-900">
            ReceiptMatch
          </span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* New Session Button */}
      <div className="px-3 py-3">
        <button
          onClick={onNewSession}
          className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          New session
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {sessions.length === 0 ? (
          <div className="mt-8 text-center">
            <Clock className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-400">No sessions yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Match some receipts to get started
            </p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.label} className="mt-4 first:mt-0">
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onLoadSession(s.id)}
                    className={`group flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition ${
                      s.id === activeSessionId
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FileCheck
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                        s.id === activeSessionId
                          ? "text-indigo-500"
                          : "text-gray-400"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {s.matchedCount}/{s.receiptCount} matched &middot;{" "}
                        {timeAgo(s.updatedAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(s.id, e)}
                      disabled={deletingId === s.id}
                      className="mt-0.5 rounded p-1 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* User footer */}
      <div className="border-t border-gray-100 px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
            <User className="h-4 w-4 text-gray-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {authSession?.user?.name || "User"}
            </p>
            <p className="truncate text-xs text-gray-400">
              {authSession?.user?.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
