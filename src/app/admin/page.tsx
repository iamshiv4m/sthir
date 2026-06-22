'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiUrl } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { isFoundingFree, FOUNDING_COHORT_SIZE } from '@/lib/founding';
import { COACHES, type CoachId } from '@/lib/coaches';

type QueueProgram = {
  id: string;
  templateName: string;
  coachNotes: string;
  draftSummary?: string;
  reviewerId?: string;
  blocks: unknown[];
};

type VideoLinks = {
  squat: string | null;
  bench: string | null;
  deadlift: string | null;
};

type IntakeAnswers = {
  name: string;
  email: string;
  phone?: string;
  goal: string;
  age?: number;
  gender?: string;
  heightCm?: number;
  bodyweightKg?: number;
  weightClass?: string;
  squat1rm?: number;
  bench1rm?: number;
  deadlift1rm?: number;
  experience?: string;
  federation?: string;
  trainingDays?: number;
  trainingStyle?: string;
  meetDate?: string;
  gymType?: string;
  equipment?: Record<string, boolean>;
  injuries?: string[];
  injuryNotes?: string;
  sleepQuality?: number;
  recoveryNotes?: string;
  cycleNotes?: string;
  proteinIntakeG?: number;
};

type QueueItem = {
  id: string;
  status: string;
  slaHoursRemaining: number;
  urgent: boolean;
  createdAt?: string;
  answers: IntakeAnswers;
  program?: QueueProgram;
  videos?: VideoLinks;
};

function programContextText(program?: QueueProgram): string {
  if (!program) return '';
  if (program.draftSummary) return program.draftSummary;
  return program.coachNotes ?? '';
}

function coachNotesForEditor(program?: QueueProgram): string {
  if (!program) return '';
  if (program.draftSummary != null) return program.coachNotes ?? '';
  return '';
}

type FunnelSummary = {
  totals: {
    intakeStarted: number;
    intakeSubmitted: number;
    intakeSubmitFailed: number;
    waitlistStarted: number;
    waitlistSubmitted: number;
    conversionRate: number | null;
  };
  intakeSteps: Array<{
    step: number;
    name: string;
    viewed: number;
    completed: number;
    validationFailed: number;
  }>;
};

type AbandonedLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  goal: string;
  stepReached: number;
  stepName: string;
  updatedAt: string;
};

export default function AdminPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [funnel, setFunnel] = useState<FunnelSummary | null>(null);
  const [leads, setLeads] = useState<AbandonedLead[]>([]);
  const [selected, setSelected] = useState<QueueItem | null>(null);
  const [notes, setNotes] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [activeCoach, setActiveCoach] = useState<CoachId>('founder');
  const [videoModal, setVideoModal] = useState<{ url: string; label: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const savedKey = sessionStorage.getItem('sthir_admin_key');
    if (savedKey) setAdminKey(savedKey);
    const savedCoach = sessionStorage.getItem('sthir_active_coach') as CoachId | null;
    if (savedCoach && COACHES.some((c) => c.id === savedCoach)) {
      setActiveCoach(savedCoach);
    }
  }, []);

  useEffect(() => {
    if (adminKey) {
      sessionStorage.setItem('sthir_admin_key', adminKey);
    } else {
      sessionStorage.removeItem('sthir_admin_key');
    }
  }, [adminKey]);

  useEffect(() => {
    sessionStorage.setItem('sthir_active_coach', activeCoach);
  }, [activeCoach]);
  const foundingFree = isFoundingFree();

  const adminHeaders = useCallback((): HeadersInit => {
    return adminKey ? { 'x-admin-key': adminKey } : {};
  }, [adminKey]);

  const load = useCallback(async () => {
    const headers = adminHeaders();
    const [queueRes, funnelRes, leadsRes] = await Promise.all([
      fetch(apiUrl('/admin/queue'), { headers }),
      fetch(apiUrl('/admin/funnel'), { headers }),
      fetch(apiUrl('/admin/leads'), { headers }),
    ]);
    if (queueRes.ok) {
      const data = await queueRes.json();
      setQueue(data.queue);
      setStats(data.stats);
    }
    if (funnelRes.ok) {
      setFunnel(await funnelRes.json());
    }
    if (leadsRes.ok) {
      const data = await leadsRes.json();
      setLeads(data.leads ?? []);
    }
  }, [adminHeaders]);

  useEffect(() => {
    let active = true;

    async function refresh() {
      const headers = adminHeaders();
      const [queueRes, funnelRes, leadsRes] = await Promise.all([
        fetch(apiUrl('/admin/queue'), { headers }),
        fetch(apiUrl('/admin/funnel'), { headers }),
        fetch(apiUrl('/admin/leads'), { headers }),
      ]);
      if (!active) return;
      if (queueRes.ok) {
        const data = await queueRes.json();
        setQueue(data.queue);
        setStats(data.stats);
      }
      if (funnelRes.ok) {
        setFunnel(await funnelRes.json());
      }
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads ?? []);
      }
    }

    void refresh();
    const t = setInterval(() => void refresh(), 30000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [adminHeaders]);

  async function reviewAction(
    intakeId: string,
    action: 'approve' | 'deliver' | 'reject',
  ) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...adminHeaders(),
    };
    const res = await fetch(apiUrl(`/admin/programs/${intakeId}`), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action,
        coachNotes: notes,
        reviewerId: activeCoach,
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as {
        message?: string | string[];
      } | null;
      const message = Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message;
      alert(message ?? 'Action failed — check admin key and intake status.');
      return;
    }
    setSelected(null);
    setNotes('');
    load();
  }

  async function downloadCsv(programId: string) {
    const res = await fetch(apiUrl(`/programs/${programId}/csv`), {
      headers: adminHeaders(),
    });
    if (!res.ok) {
      alert('CSV download failed — check admin key and deliver status.');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'sthir_program.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const statCards = foundingFree
    ? [
        { label: 'Pending review', value: stats.pendingReview ?? 0 },
        { label: 'Delivered', value: stats.delivered ?? 0 },
        {
          label: 'Founding programs',
          value: `${stats.cohortCount ?? 0}/${FOUNDING_COHORT_SIZE}`,
        },
      ]
    : [
        { label: 'Pending review', value: stats.pendingReview ?? 0 },
        { label: 'Delivered', value: stats.delivered ?? 0 },
        { label: 'Waitlist', value: stats.waitlist ?? 0 },
      ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Coach Review Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        12-hour SLA queue — approve before delivery
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Input
          type="password"
          placeholder="Admin API key"
          className="max-w-xs"
          autoComplete="off"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
        />
        <Select
          value={activeCoach}
          onValueChange={(v) => setActiveCoach(v as CoachId)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Reviewing as…" />
          </SelectTrigger>
          <SelectContent>
            {COACHES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={load}>
          Refresh
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2 text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <CardTitle className="text-xs font-normal text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {funnel && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Form funnel</CardTitle>
            <p className="text-sm text-muted-foreground">
              Where users drop off — intake started {funnel.totals.intakeStarted}
              , submitted {funnel.totals.intakeSubmitted}
              {funnel.totals.conversionRate != null &&
                ` (${funnel.totals.conversionRate}% conversion)`}
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Step</th>
                    <th className="pb-2 pr-4 font-medium">Viewed</th>
                    <th className="pb-2 pr-4 font-medium">Completed</th>
                    <th className="pb-2 font-medium">Validation errors</th>
                  </tr>
                </thead>
                <tbody>
                  {funnel.intakeSteps.map((row) => (
                    <tr key={row.step} className="border-b border-border/50">
                      <td className="py-2 pr-4">
                        {row.step + 1}. {row.name}
                      </td>
                      <td className="py-2 pr-4">{row.viewed}</td>
                      <td className="py-2 pr-4">{row.completed}</td>
                      <td className="py-2">{row.validationFailed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Waitlist: {funnel.totals.waitlistStarted} started →{' '}
              {funnel.totals.waitlistSubmitted} submitted
            </p>
          </CardContent>
        </Card>
      )}

      {leads.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">
              Abandoned forms ({leads.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Users who entered contact info but did not submit — follow up on
              WhatsApp
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Name</th>
                    <th className="pb-2 pr-4 font-medium">Phone</th>
                    <th className="pb-2 pr-4 font-medium">Email</th>
                    <th className="pb-2 pr-4 font-medium">Stopped at</th>
                    <th className="pb-2 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const digits = lead.phone.replace(/\D/g, '');
                    const wa =
                      digits.length >= 10
                        ? `https://wa.me/91${digits.slice(-10)}`
                        : null;
                    return (
                      <tr
                        key={lead.id}
                        className="border-b border-border/50"
                      >
                        <td className="py-2 pr-4 font-medium">{lead.name}</td>
                        <td className="py-2 pr-4">
                          {wa ? (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline-offset-2 hover:underline"
                            >
                              {lead.phone}
                            </a>
                          ) : (
                            lead.phone
                          )}
                        </td>
                        <td className="py-2 pr-4">{lead.email}</td>
                        <td className="py-2 pr-4">
                          {lead.stepName} (step {lead.stepReached + 1})
                        </td>
                        <td className="py-2 text-muted-foreground">
                          {new Date(lead.updatedAt).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          {queue.length === 0 && (
            <p className="text-muted-foreground">
              No items in queue. Submit via /intake
            </p>
          )}
          {queue.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelected(item);
                setNotes(coachNotesForEditor(item.program));
              }}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition',
                item.urgent
                  ? 'border-destructive/50 bg-destructive/5'
                  : 'border-border',
                selected?.id === item.id && 'ring-2 ring-primary',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{item.answers.name}</span>
                <div className="flex shrink-0 flex-wrap gap-1">
                  <Badge variant="secondary">{item.status}</Badge>
                  {item.program?.reviewerId && (
                    <Badge variant="outline" className="text-xs">
                      {COACHES.find((c) => c.id === item.program?.reviewerId)
                        ?.name ?? item.program.reviewerId}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.answers.email}
              </p>
              <p className="mt-1 text-xs text-primary">
                SLA: {item.slaHoursRemaining.toFixed(1)}h remaining
              </p>
            </button>
          ))}
        </div>

        {selected && (
          <Card>
            <CardHeader>
              <CardTitle>{selected.answers.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {selected.answers.goal} | {selected.program?.templateName}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ── Athlete Details ── */}
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Athlete details</p>

                {/* Personal */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
                  {[
                    { label: 'Email', value: selected.answers.email },
                    { label: 'Phone', value: selected.answers.phone },
                    { label: 'Age', value: selected.answers.age },
                    { label: 'Gender', value: selected.answers.gender },
                    { label: 'Height', value: selected.answers.heightCm ? `${selected.answers.heightCm} cm` : undefined },
                    { label: 'Bodyweight', value: selected.answers.bodyweightKg ? `${selected.answers.bodyweightKg} kg` : undefined },
                    { label: 'Weight Class', value: selected.answers.weightClass || '—' },
                  ].map(({ label, value }) =>
                    value != null ? (
                      <div key={label}>
                        <span className="text-xs text-muted-foreground">{label}: </span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ) : null,
                  )}
                </div>

                {/* Lifts */}
                {(selected.answers.squat1rm || selected.answers.bench1rm || selected.answers.deadlift1rm) && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">1RMs</p>
                    <div className="flex flex-wrap gap-3 text-sm font-medium">
                      {selected.answers.squat1rm && <span>S: {selected.answers.squat1rm} kg</span>}
                      {selected.answers.bench1rm && <span>B: {selected.answers.bench1rm} kg</span>}
                      {selected.answers.deadlift1rm && <span>D: {selected.answers.deadlift1rm} kg</span>}
                    </div>
                  </div>
                )}

                {/* Training */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
                  {[
                    { label: 'Experience', value: selected.answers.experience },
                    { label: 'Federation', value: selected.answers.federation },
                    { label: 'Meet Date', value: selected.answers.meetDate },
                    { label: 'Training Days', value: selected.answers.trainingDays },
                    { label: 'Style', value: selected.answers.trainingStyle },
                    { label: 'Gym Type', value: selected.answers.gymType },
                  ].map(({ label, value }) =>
                    value != null ? (
                      <div key={label}>
                        <span className="text-xs text-muted-foreground">{label}: </span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ) : null,
                  )}
                </div>

                {/* Equipment */}
                {selected.answers.equipment && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Equipment</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(selected.answers.equipment)
                        .filter(([, v]) => v)
                        .map(([k]) => (
                          <span key={k} className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary capitalize">
                            {k.replace(/([A-Z])/g, ' $1')}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Health */}
                {(selected.answers.injuries?.length || selected.answers.injuryNotes || selected.answers.sleepQuality != null || selected.answers.recoveryNotes || selected.answers.cycleNotes || selected.answers.proteinIntakeG) && (
                  <div className="space-y-1 text-sm">
                    <p className="text-xs text-muted-foreground">Health & Recovery</p>
                    {selected.answers.injuries?.length ? (
                      <div><span className="text-xs text-muted-foreground">Injuries: </span><span>{selected.answers.injuries.join(', ')}</span></div>
                    ) : null}
                    {selected.answers.injuryNotes ? (
                      <div><span className="text-xs text-muted-foreground">Injury notes: </span><span>{selected.answers.injuryNotes}</span></div>
                    ) : null}
                    {selected.answers.sleepQuality != null ? (
                      <div><span className="text-xs text-muted-foreground">Sleep quality: </span><span>{selected.answers.sleepQuality}/5</span></div>
                    ) : null}
                    {selected.answers.recoveryNotes ? (
                      <div><span className="text-xs text-muted-foreground">Recovery notes: </span><span>{selected.answers.recoveryNotes}</span></div>
                    ) : null}
                    {selected.answers.cycleNotes ? (
                      <div><span className="text-xs text-muted-foreground">Cycle notes: </span><span>{selected.answers.cycleNotes}</span></div>
                    ) : null}
                    {selected.answers.proteinIntakeG ? (
                      <div><span className="text-xs text-muted-foreground">Protein intake: </span><span>{selected.answers.proteinIntakeG} g/day</span></div>
                    ) : null}
                  </div>
                )}
              </div>

              {selected.videos &&
                (selected.videos.squat ||
                  selected.videos.bench ||
                  selected.videos.deadlift) && (
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Technique videos
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { key: 'squat', label: 'Squat' },
                          { key: 'bench', label: 'Bench' },
                          { key: 'deadlift', label: 'Deadlift' },
                        ] as const
                      ).map(({ key, label }) =>
                        selected.videos?.[key] ? (
                          <button
                            key={key}
                            onClick={() => setVideoModal({ url: selected.videos![key]!, label })}
                            className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
                          >
                            <span>▶</span> {label}
                          </button>
                        ) : null,
                      )}
                    </div>
                  </div>
                )}
              {programContextText(selected.program) && (
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Auto context (read-only)
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-foreground/90">
                    {programContextText(selected.program)}
                  </pre>
                </div>
              )}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Coach notes for athlete
                </p>
                <Textarea
                  rows={6}
                  placeholder="Write notes for the athlete — only this goes into CSV/PDF export."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {selected.program?.blocks.length ?? 0} program rows generated
              </p>
              {selected.status === 'pending_review' && (
                <p className="text-xs text-muted-foreground">
                  Step 1: Approve after reviewing notes → Step 2: Deliver CSV/PDF
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  disabled={!['paid', 'pending_review'].includes(selected.status)}
                  onClick={() => reviewAction(selected.id, 'approve')}
                >
                  {selected.status === 'approved' ? 'Approved' : 'Approve'}
                </Button>
                <Button
                  disabled={selected.status !== 'approved'}
                  onClick={() => reviewAction(selected.id, 'deliver')}
                >
                  Deliver (CSV/PDF)
                </Button>
                <Button
                  variant="destructive"
                  disabled={['delivered', 'rejected', 'refunded'].includes(
                    selected.status,
                  )}
                  onClick={() => reviewAction(selected.id, 'reject')}
                >
                  Reject
                </Button>
              </div>
              {selected.status === 'delivered' && selected.program?.id && (
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-sm"
                  onClick={() => downloadCsv(selected.program!.id)}
                >
                  Download CSV export →
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Video Modal */}
      {videoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => {
            videoRef.current?.pause();
            setVideoModal(null);
          }}
        >
          <div
            className="relative w-full max-w-3xl rounded-xl border border-border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">{videoModal.label} — Technique Video</p>
              <button
                onClick={() => {
                  videoRef.current?.pause();
                  setVideoModal(null);
                }}
                className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-4">
              <video
                ref={videoRef}
                src={videoModal.url}
                controls
                autoPlay
                preload="auto"
                className="w-full rounded-lg bg-black"
                style={{ maxHeight: '70vh' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
