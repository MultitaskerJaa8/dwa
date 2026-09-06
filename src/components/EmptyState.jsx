export default function EmptyState({ title = "No data", description, action }) {
  return (
    <div className="card">
      <div className="card-bd text-center">
        <div className="text-lg font-extrabold text-slate-900">{title}</div>
        {description ? <div className="text-sm muted mt-2">{description}</div> : null}
        {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}
