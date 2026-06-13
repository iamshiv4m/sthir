import { apiUrl } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Partner = {
  id: string;
  name: string;
  city: string;
  contactName: string;
  referralCode: string;
  status: string;
  referrals: number;
};

async function getPartners(): Promise<Partner[]> {
  try {
    const res = await fetch(apiUrl("/partners"), { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { partners: Partner[] };
    return data.partners;
  } catch {
    return [];
  }
}

function statusVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "active") return "default";
  if (status === "signed") return "secondary";
  return "outline";
}

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Gym & Warehouse Partners</h1>
      <p className="mt-2 text-muted-foreground">
        Refer athletes with your code — ₹200 per paid program or 10th referral free team block
      </p>

      <div className="mt-10 space-y-4">
        {partners.map((p) => (
          <Card key={p.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>{p.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {p.city} — {p.contactName}
                </p>
                <p className="mt-1 font-mono text-primary">{p.referralCode}</p>
              </div>
              <div className="text-right">
                <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                <p className="mt-2 text-sm text-muted-foreground">{p.referrals} referrals</p>
              </div>
            </CardHeader>
          </Card>
        ))}

        {partners.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Partner list empty — run API seed or check backend.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
