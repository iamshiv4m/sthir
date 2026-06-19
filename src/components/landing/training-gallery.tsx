import Image from 'next/image';
import { LANDING_IMAGES } from '@/lib/landing-images';
import { Reveal } from '@/components/landing/reveal';
import { SectionHeader } from '@/components/landing/section-header';

export function TrainingGallery() {
  const [featured, ...rest] = LANDING_IMAGES.gallery;

  return (
    <section className="border-y border-border bg-muted/10 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeader
            eyebrow="Real training"
            title="Built for barbells, platforms & warehouse gyms"
            description="Not a generic fitness app — programming for athletes who actually load the bar."
            className="max-w-2xl"
          />
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-2">
          <Reveal className="sm:col-span-2 lg:col-span-3 lg:row-span-2">
            <figure className="group relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-border/70 sm:min-h-[320px]">
              <Image
                src={featured.src}
                alt={featured.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <figcaption className="absolute bottom-0 left-0 p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  {featured.label}
                </p>
                <p className="mt-1 max-w-sm text-sm text-foreground/90">
                  {featured.alt}
                </p>
              </figcaption>
            </figure>
          </Reveal>

          {rest.map((item, i) => (
            <Reveal
              key={`${item.src}-${item.label}`}
              delay={60 + i * 50}
              className={i === rest.length - 1 ? 'lg:col-span-2' : undefined}
            >
              <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 lg:aspect-auto lg:h-full lg:min-h-[150px]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
                <figcaption className="absolute bottom-0 left-0 p-3">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-primary sm:text-xs">
                    {item.label}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
