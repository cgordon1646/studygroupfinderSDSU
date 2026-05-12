import { useCallback, useEffect, useState } from "react";

export function useToast(durationMs = 4200) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), durationMs);
    return () => window.clearTimeout(t);
  }, [message, durationMs]);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  const dismiss = useCallback(() => setMessage(null), []);

  return { message, showToast, dismiss };
}
