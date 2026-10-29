export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-12 max-w-3xl md:mb-16">
      <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-cyan">
        <span className="h-px w-10 bg-cyan/60" />
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">{title}</h2>
      {subtitle && <p className="mt-5 text-lg text-muted">{subtitle}</p>}
    </div>
  );
}
