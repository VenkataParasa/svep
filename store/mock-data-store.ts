"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { issues as seedIssues } from "@/data/issues";
import type { Issue, Candidate, Representative } from "@/lib/types";

function genId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

interface MockDataState {
  issues: Issue[];
  candidates: Candidate[];
  representatives: Representative[];

  addIssue: (issue: Omit<Issue, "id" | "slug"> & { slug?: string }) => Issue;
  updateIssue: (id: string, patch: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;

  addCandidate: (candidate: Omit<Candidate, "id">) => Candidate;
  updateCandidate: (id: string, patch: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;

  addRepresentative: (rep: Omit<Representative, "id">) => Representative;
  updateRepresentative: (id: string, patch: Partial<Representative>) => void;
  deleteRepresentative: (id: string) => void;

  resetToSeed: () => void;
}

export const useMockDataStore = create<MockDataState>()(
  persist(
    (set, get) => ({
      issues: seedIssues,
      candidates: [],
      representatives: [],

      addIssue: (issue) => {
        const created: Issue = {
          ...issue,
          id: genId("issue"),
          slug: issue.slug ?? issue.title.toLowerCase().replace(/\s+/g, "-"),
        };
        set({ issues: [...get().issues, created] });
        return created;
      },
      updateIssue: (id, patch) =>
        set({ issues: get().issues.map((i) => (i.id === id ? { ...i, ...patch } : i)) }),
      deleteIssue: (id) => set({ issues: get().issues.filter((i) => i.id !== id) }),

      addCandidate: (candidate) => {
        const created: Candidate = { ...candidate, id: genId("cand") };
        set({ candidates: [...get().candidates, created] });
        return created;
      },
      updateCandidate: (id, patch) =>
        set({ candidates: get().candidates.map((c) => (c.id === id ? { ...c, ...patch } : c)) }),
      deleteCandidate: (id) => set({ candidates: get().candidates.filter((c) => c.id !== id) }),

      addRepresentative: (rep) => {
        const created: Representative = { ...rep, id: genId("rep") };
        set({ representatives: [...get().representatives, created] });
        return created;
      },
      updateRepresentative: (id, patch) =>
        set({
          representatives: get().representatives.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        }),
      deleteRepresentative: (id) =>
        set({ representatives: get().representatives.filter((r) => r.id !== id) }),

      resetToSeed: () =>
        set({ issues: seedIssues, candidates: [], representatives: [] }),
    }),
    { name: "svep-mock-data" }
  )
);
