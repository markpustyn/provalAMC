"use client";

import { cn } from "@/lib/utils";

const ORDER_FLOW = ["Unassiged", "Assigned", "Quality Control", "Corrections", "Submitted"] as const;
type OrderStatus = (typeof ORDER_FLOW)[number] | "canceled";

export function OrderProgress({
  currentStatus,
  className,
}: {
  currentStatus: string | undefined;
  className?: string;
}) {
  const normalized = (currentStatus || "Unassiged") as OrderStatus;

  // Special case: canceled
  if (normalized === "canceled") {
    return (
      <div className={cn("w-full rounded-xl border border-red-200 bg-red-50 p-4", className)}>
        <p className="text-sm font-medium text-red-800">Order status</p>
        <p className="mt-1 text-lg font-semibold text-red-900">Canceled</p>
        <p className="mt-2 text-sm text-red-700">
          This order has been canceled. Progress is no longer tracked.
        </p>
      </div>
    );
  }

  const idx = Math.max(0, ORDER_FLOW.indexOf(normalized as any));
  const total = ORDER_FLOW.length;
  const pct = Math.round((idx / (total - 1)) * 100);

  return (
    <div className={cn("w-full", className)}>

      {/* Stepper */}
      <ol className="flex w-full items-center">
        {ORDER_FLOW.map((step, i) => {
          const isDone = i < idx;
          const isCurrent = i === idx;

          return (
        <li key={step} className="flex min-w-0 flex-1 items-center">
              {/* Left connector (hidden for first) */}
              <div
                className={cn(
                  "hidden h-1 flex-1 rounded-full sm:block",
                  i === 0 ? "invisible" : isDone ? "bg-green-600" : i <= idx ? "bg-green-600" : "bg-gray-200"
                )}
              />

              {/* Dot + label */}
              <div className="mx-2 flex shrink-0 flex-col items-center">
                <div
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full border text-[10px] font-semibold leading-none",
                    isDone && "bg-green-600 border-green-600 text-white",
                    isCurrent && "bg-white border-green-600 ring-4 ring-green-100 text-green-700",
                    !isDone && !isCurrent && "bg-white border-gray-300 text-gray-400"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                  title={step}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                <span className="mt-2 hidden whitespace-nowrap text-xs text-gray-700 sm:block">{step}</span>
              </div>

              {/* Right connector (hidden for last) */}
              <div
                className={cn(
                  "hidden h-1 flex-1 rounded-full sm:block",
                  i === total - 1 ? "invisible" : i < idx ? "bg-green-600" : "bg-gray-200"
                )}
              />
            </li>
          );
        })}
      </ol>

      {/* Linear progress for SR */}
      <div className="sr-only" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        {pct}% complete
      </div>
    </div>
  );
}
