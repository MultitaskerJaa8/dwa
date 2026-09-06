export default function PageHeader({ title, description, right }) {
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
          {title}
        </h1>
        {description ? (
          <p className="text-sm md:text-base muted mt-1 max-w-3xl">
            {description}
          </p>
        ) : null}
      </div>

      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}
