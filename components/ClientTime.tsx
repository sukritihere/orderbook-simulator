"use client";

import { useEffect, useState } from "react";

interface ClientTimeProps {
  timestamp: number | string | Date;
  prefix?: string;
}

export default function ClientTime({ timestamp, prefix }: ClientTimeProps) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    const date = new Date(timestamp);
    const timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    setFormatted(timeString);
  }, [timestamp]);

  return (
    <span className="text-xs text-muted-foreground">
      {prefix ? `${prefix} ${formatted}` : formatted}
    </span>
  );
}
