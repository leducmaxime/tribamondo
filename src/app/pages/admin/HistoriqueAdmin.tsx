"use client";
import { useState, useEffect, useMemo } from "react";
import type { AuditLog } from "@/types/database";
import { ChevronLeft, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

const PAGE_SIZE = 50;

type SortField = "created_at" | "username" | "action_type" | "resource_type";
type SortDir = "asc" | "desc";

type DateFilterMode = "all" | "day" | "week" | "month" | "year";

function formatDate(dateStr: string, mode: DateFilterMode, filterValue: string): boolean {
  if (mode === "all") return true;
  if (!dateStr) return false;
  
  const utc = dateStr.endsWith("Z") || dateStr.includes("+") ? dateStr : dateStr + "Z";
  const logDate = new Date(utc);
  const parisDate = new Date(logDate.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  
  switch (mode) {
    case "day": {
      if (!filterValue) return true;
      const filterDate = new Date(filterValue + "T00:00:00");
      const parisFilter = new Date(filterDate.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
      return parisDate.toDateString() === parisFilter.toDateString();
    }
    case "week": {
      if (!filterValue) return true;
      const [year, week] = filterValue.split("-W").map(Number);
      const logYear = parisDate.getFullYear();
      const logWeek = getWeekNumber(parisDate);
      return logYear === year && logWeek === week;
    }
    case "month": {
      if (!filterValue) return true;
      const filterDate = new Date(filterValue + "-01");
      const parisFilter = new Date(filterDate.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
      return parisDate.getMonth() === parisFilter.getMonth() && parisDate.getFullYear() === parisFilter.getFullYear();
    }
    case "year": {
      if (!filterValue) return true;
      const year = parseInt(filterValue);
      return parisDate.getFullYear() === year;
    }
    default:
      return true;
  }
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}

function formatParis(dateStr: string) {
  const utc = dateStr.endsWith("Z") || dateStr.includes("+") ? dateStr : dateStr + "Z";
  return new Date(utc).toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (sortField !== field) return <ChevronsUpDown className="inline h-3.5 w-3.5 ml-1 text-white/30" />;
  return sortDir === "asc"
    ? <ChevronUp className="inline h-3.5 w-3.5 ml-1 text-primary" />
    : <ChevronDown className="inline h-3.5 w-3.5 ml-1 text-primary" />;
}

export function HistoriqueAdmin() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ username: "", action_type: "", resource_type: "", date_mode: "all" as DateFilterMode, date_value: "" });
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  useEffect(() => { checkAuth(); }, []);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json() as { authenticated: boolean };
      if (!data.authenticated) { window.location.href = "/admin/login"; return; }
      fetchLogs();
    } catch { window.location.href = "/admin/login"; }
  }

  async function fetchLogs() {
    try {
      const res = await fetch("/api/audit");
      const data = await res.json() as { success: boolean; data: AuditLog[] };
      if (data.success) setLogs(data.data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  const uniqueUsernames = useMemo(() => Array.from(new Set(logs.map(l => l.username))), [logs]);
  const uniqueActions = useMemo(() => Array.from(new Set(logs.map(l => l.action_type))), [logs]);
  const uniqueResources = useMemo(() => Array.from(new Set(logs.map(l => l.resource_type))), [logs]);

  const filtered = useMemo(() => logs.filter(log =>
    (filters.username === "" || log.username === filters.username) &&
    (filters.action_type === "" || log.action_type === filters.action_type) &&
    (filters.resource_type === "" || log.resource_type === filters.resource_type) &&
    formatDate(log.created_at, filters.date_mode, filters.date_value)
  ), [logs, filters]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const va = a[sortField] ?? "";
    const vb = b[sortField] ?? "";
    return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  }), [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeFilter(key: keyof typeof filters, value: string | DateFilterMode) {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  }

  const actionLabel = (t: string) =>
    t === "CREATE" ? "CRÉATION" : t === "UPDATE" ? "MODIFICATION" :
    t === "DELETE" ? "SUPPRESSION" : t === "LOGIN" ? "CONNEXION" :
    t === "LOGOUT" ? "DÉCONNEXION" : t;

  const resourceLabel = (r: string) =>
    r === "Video" ? "Vidéo" : r === "Auth" ? "Connexion" :
    r === "Interview" ? "Interview" : r === "Groupe" ? "Groupe" : r;

  const actionColor = (t: string) =>
    t === "CREATE" ? "bg-green-500/10 text-green-500" :
    t === "UPDATE" ? "bg-blue-500/10 text-blue-500" :
    t === "DELETE" ? "bg-red-500/10 text-red-500" :
    t === "LOGOUT" ? "bg-gray-500/10 text-gray-400" :
    "bg-white/10 text-white/60";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-6xl">
        <div className="mb-6">
          <a href="/admin" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Retour au Dashboard
          </a>
        </div>

        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Historique des <span className="text-primary">actions</span>
          </h1>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 rounded-xl border border-red-500/20 bg-black/40 p-4">
          <select
            value={filters.username}
            onChange={(e) => changeFilter("username", e.target.value)}
            className="rounded-lg border border-red-500/30 bg-black/60 px-4 py-2 text-sm text-white focus:border-primary focus:outline-none"
          >
            <option value="">Tous les utilisateurs</option>
            {uniqueUsernames.map(u => <option key={u} value={u}>{u}</option>)}
          </select>

          <select
            value={filters.action_type}
            onChange={(e) => changeFilter("action_type", e.target.value)}
            className="rounded-lg border border-red-500/30 bg-black/60 px-4 py-2 text-sm text-white focus:border-primary focus:outline-none"
          >
            <option value="">Toutes les actions</option>
            {uniqueActions.map(a => <option key={a} value={a}>{actionLabel(a)}</option>)}
          </select>

          <select
            value={filters.resource_type}
            onChange={(e) => changeFilter("resource_type", e.target.value)}
            className="rounded-lg border border-red-500/30 bg-black/60 px-4 py-2 text-sm text-white focus:border-primary focus:outline-none"
          >
            <option value="">Toutes les ressources</option>
            {uniqueResources.map(r => <option key={r} value={r}>{resourceLabel(r)}</option>)}
          </select>

          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <select
              value={filters.date_mode}
              onChange={(e) => changeFilter("date_mode", e.target.value as DateFilterMode)}
              className="rounded-lg border border-red-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            >
              <option value="all">Toutes les dates</option>
              <option value="day">Par jour</option>
              <option value="week">Par semaine</option>
              <option value="month">Par mois</option>
              <option value="year">Par année</option>
            </select>
            {filters.date_mode === "day" && (
              <input
                type="date"
                value={filters.date_value}
                onChange={(e) => changeFilter("date_value", e.target.value)}
                className="rounded-lg border border-red-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              />
            )}
            {filters.date_mode === "week" && (
              <input
                type="week"
                value={filters.date_value}
                onChange={(e) => changeFilter("date_value", e.target.value)}
                className="rounded-lg border border-red-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              />
            )}
            {filters.date_mode === "month" && (
              <input
                type="month"
                value={filters.date_value}
                onChange={(e) => changeFilter("date_value", e.target.value)}
                className="rounded-lg border border-red-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              />
            )}
            {filters.date_mode === "year" && (
              <input
                type="number"
                min="2020"
                max="2030"
                value={filters.date_value}
                onChange={(e) => changeFilter("date_value", e.target.value)}
                placeholder="Année"
                className="w-24 rounded-lg border border-red-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              />
            )}
          </div>

          {(filters.username || filters.action_type || filters.resource_type) && (
            <button
              onClick={() => { setFilters({ username: "", action_type: "", resource_type: "", date_mode: "all", date_value: "" }); setPage(1); }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white"
            >
              Réinitialiser
            </button>
          )}

          <span className="ml-auto self-center text-xs text-white/40">
            {sorted.length} résultat{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
                  {([ 
                    { field: "created_at" as SortField, label: "Date & Heure" },
                    { field: "username" as SortField, label: "Utilisateur" },
                    { field: "action_type" as SortField, label: "Action" },
                    { field: "resource_type" as SortField, label: "Ressource" },
                  ]).map(({ field, label }) => (
                    <th
                      key={field}
                      className="px-4 py-4 font-medium cursor-pointer select-none hover:text-white transition-colors whitespace-nowrap"
                      onClick={() => handleSort(field)}
                    >
                      {label}
                      <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
                    </th>
                  ))}
                  <th className="px-4 py-4 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-white/40 italic">
                      Aucune activité trouvée pour ces filtres.
                    </td>
                  </tr>
                ) : (
                  paginated.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4 text-sm text-white/60 whitespace-nowrap">
                        {formatParis(log.created_at)}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-primary whitespace-nowrap">
                        {log.username}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${actionColor(log.action_type)}`}>
                          {actionLabel(log.action_type)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-white/80 whitespace-nowrap">
                        {resourceLabel(log.resource_type)}
                      </td>
                      <td
                        className="px-4 py-4 text-sm text-white/60 max-w-md truncate cursor-default"
                        title={log.description ?? undefined}
                      >
                        {log.description}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
              <p className="text-sm text-white/40">
                Page {page} sur {totalPages} — {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} sur {sorted.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  «
                </button>
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                        p === page
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ›
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
