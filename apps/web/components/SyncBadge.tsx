type Props = { syncedAt?: string; source?: string };

export function SyncBadge({ syncedAt, source }: Props) {
  return (
    <p className="sync-badge text-muted">
      {syncedAt && <>Synced {new Date(syncedAt).toLocaleString()}</>}
      {source && <> · {source}</>}
      {" · "}
      <span className="badge badge-active">Live in-platform</span>
    </p>
  );
}
