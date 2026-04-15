'use client'
import { useState } from "react";
import type { MetricAlarm } from "@aws-sdk/client-cloudwatch";

export default function AlarmCard({
  alarm,
  isAdmin = false,
}: {
  alarm: MetricAlarm;
  isAdmin?: boolean;
}) {
  const Alarmstate = alarm.StateValue ?? "INSUFFICIENT_DATA";
  const [visible, setVisible] = useState(true);
  const state = alarm.StateValue ?? "INSUFFICIENT_DATA";
  const stateBorderMap: Record<string, string> = {
    OK: "border-ok",
    ALARM: "border-alarm",
    INSUFFICIENT_DATA: "border-insufficient",
  };

  const stateTextMap: Record<string, string> = {
    OK: "text-ok",
    ALARM: "text-alarm",
    INSUFFICIENT_DATA: "text-insufficient",
  };

  return (
    <div
      className={`rounded-xl border ${
        stateBorderMap[state]
      } bg-panel p-5 shadow-panel flex flex-col`}
    >
      <h3 className="text-sm font-semibold text-white mb-2 break-words">
        {alarm.AlarmName ?? "Unnamed alarm"}
      </h3>

      <p className="text-xs text-mutedText line-clamp-4 flex-grow">
        {alarm.StateReason ?? "No state reason provided."}
      </p>

            <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-mutedText">Status</span>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-semibold ${stateTextMap[Alarmstate]}`}
          >
            {Alarmstate}
          </span>
          {isAdmin && (
            <button
              type="button"
              role="switch"
              aria-checked={visible}
              onClick={() => setVisible((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                visible ? "bg-ok" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  visible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
