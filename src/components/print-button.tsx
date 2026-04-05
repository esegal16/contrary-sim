"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn btn-secondary px-6 py-3 text-sm"
    >
      Print This Page
    </button>
  );
}
