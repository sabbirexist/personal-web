"use client";

import { useEffect, useState } from "react";

export function LocalClock({ timezone }: { timezone: string }) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 20000);
    return () => clearInterval(id);
  }, [timezone]);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time}
    </span>
  );
}
