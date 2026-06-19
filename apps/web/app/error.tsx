"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container" style={{ paddingTop: "3rem" }}>
      <h1>Something went wrong</h1>
      <p className="text-muted mt-2">{error.message}</p>
      <button type="button" className="btn mt-2" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
