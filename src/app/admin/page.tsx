'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiUrl } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type QueueItem = {
  id: string;
  status: string;
  slaHoursRemaining: number;
  urgent: boolean;
  answers: { name: string; email: string; goal: string };
  program?: {
    id: string;
    templateName: string;
    coachNotes: string;
    blocks: unknown[];
  };
};

export default function AdminPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<QueueItem | null>(null);
  const [notes, setNotes] = useState('');
  const [adminKey, setAdminKey] = useState('');

  const load = useCallback(async () => {
    const headers: HeadersInit = adminKey ? { 'x-admin-key': adminKey } : {};
    const res = await fetch(apiUrl('/admin/queue'), { headers });
    if (!res.ok) return;
    const data = await res.json();
    setQueue(data.queue);
    setStats(data.stats);
  }, [adminKey]);

  useEffect(() => {
    let active = true;

    async function refresh() {
      const headers: HeadersInit = adminKey ? { 'x-admin-key': adminKey } : {};
      const res = await fetch(apiUrl('/admin/queue'), { headers });
      if (!res.ok || !active) return;
      const data = await res.json();
      setQueue(data.queue);
      setStats(data.stats);
    }

    void refresh();
    const t = setInterval(() => void refresh(), 30000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [adminKey]);

  async function reviewAction(
    intakeId: string,
    action: 'approve' | 'deliver' | 'reject',
  ) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(adminKey ? { 'x-admin-key': adminKey } : {}),
    };
    await fetch(apiUrl(`/admin/programs/${intakeId}`), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action,
        coachNotes: notes,
        reviewerId: 'founder',
      }),
    });
    setSelected(null);
    setNotes('');
    load();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Coach Review Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        12-hour SLA queue — approve before delivery
      </p>

      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Admin API key (optional in dev)"
          className="max-w-xs"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
        />
        <Button variant="outline" onClick={load}>
          Refresh
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Pending review', value: stats.pendingReview ?? 0 },
          { label: 'Delivered', value: stats.delivered ?? 0 },
          { label: 'Waitlist', value: stats.waitlist ?? 0 },
        ].map((s) => (
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
                setNotes(item.program?.coachNotes ?? '');
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
                <Badge variant="secondary">{item.status}</Badge>
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
              <Textarea
                rows={8}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {selected.program?.blocks.length ?? 0} program rows generated
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => reviewAction(selected.id, 'approve')}
                >
                  Approve
                </Button>
                <Button onClick={() => reviewAction(selected.id, 'deliver')}>
                  Deliver (CSV/PDF)
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => reviewAction(selected.id, 'reject')}
                >
                  Reject
                </Button>
              </div>
              {selected.program?.id && (
                <a
                  href={apiUrl(`/programs/${selected.program.id}/csv`)}
                  className="inline-block text-sm text-primary hover:underline"
                >
                  Download CSV export →
                </a>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
