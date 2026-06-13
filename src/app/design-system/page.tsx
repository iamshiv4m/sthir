import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SthirLogo } from "@/components/brand/sthir-logo";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Design System",
  description: "Internal UI kit for Sthir designer review.",
  path: "/design-system",
  noIndex: true,
});

const swatches = [
  { name: "Primary (amber)", token: "bg-primary", text: "text-primary-foreground" },
  { name: "Background", token: "bg-background", text: "text-foreground border border-border" },
  { name: "Card", token: "bg-card", text: "text-card-foreground border border-border" },
  { name: "Muted", token: "bg-muted", text: "text-muted-foreground" },
  { name: "Destructive", token: "bg-destructive/20", text: "text-destructive border border-destructive/30" },
];

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Badge className="mb-4">Designer review — v0.2</Badge>
      <h1 className="text-3xl font-bold">Sthir UI Kit</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Built on shadcn/ui (base-nova). Dark-first, amber accent, workout-native landing motifs.
        Review live flows at <code className="text-primary">/</code>,{" "}
        <code className="text-primary">/intake</code>, <code className="text-primary">/waitlist</code>,{" "}
        <code className="text-primary">/admin</code>, <code className="text-primary">/legal/refund</code>.
        Full checklist: <code className="text-primary">docs/product/designer-review-checklist.md</code>
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Logo</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Brand asset: <code className="text-primary">public/brand/sthir-logo.png</code> — used in
          header, footer, favicon, and OG image.
        </p>
        <div className="mt-4 rounded-xl border border-border bg-background p-8">
          <SthirLogo height={100} variant="full" />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Header uses <code className="text-primary">sthir-logo-compact.png</code> (transparent).
          Favicon uses <code className="text-primary">sthir-logo-mark.png</code>.
        </p>
      </section>

      <Separator className="my-12" />

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Brand colors</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {swatches.map((s) => (
            <div key={s.name} className={`rounded-lg px-4 py-6 ${s.token} ${s.text}`}>
              {s.name}
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      <section>
        <h2 className="text-xl font-semibold">Typography</h2>
        <div className="mt-4 space-y-2">
          <p className="text-4xl font-bold">Heading 1 — Geist Sans</p>
          <p className="text-2xl font-semibold">Heading 2</p>
          <p className="text-muted-foreground">Body — muted foreground for secondary copy</p>
          <p className="font-mono text-sm text-primary">STHIR-DEL-01 — mono for codes</p>
        </div>
      </section>

      <Separator className="my-12" />

      <section>
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="lg">Large CTA</Button>
        </div>
      </section>

      <Separator className="my-12" />

      <section>
        <h2 className="text-xl font-semibold">Form elements</h2>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Sample form</CardTitle>
            <CardDescription>Intake & waitlist use these patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Email" />
            <Textarea placeholder="Coach notes" rows={3} />
            <div className="flex items-center gap-2">
              <Checkbox defaultChecked />
              <span className="text-sm">Checkbox label</span>
            </div>
            <Progress value={66} />
          </CardContent>
        </Card>
      </section>

      <Separator className="my-12" />

      <section>
        <h2 className="text-xl font-semibold">Badges & alerts</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <Alert className="mt-4">
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>Program delivered within 12 hours SLA.</AlertDescription>
        </Alert>
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>SLA breach — escalate to founder.</AlertDescription>
        </Alert>
      </section>

      <Separator className="my-12" />

      <section>
        <h2 className="text-xl font-semibold">Designer sign-off checklist</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>Brand feels serious PL / warehouse gym — not generic fitness app?</li>
          <li>Amber accent used sparingly on CTAs and highlights?</li>
          <li>Mobile: intake steps readable at 375px width?</li>
          <li>Admin queue: urgent SLA items visually distinct?</li>
          <li>Typography hierarchy clear on landing hero?</li>
          <li>Any copy/layout changes → attach PNG + page URL in GitLab issue</li>
        </ul>
      </section>
    </div>
  );
}
