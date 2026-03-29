'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  seconds: number;
  onExpire: () => void;
}

export function Countdown({ seconds, onExpire }: CountdownProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <span className="font-mono text-lg font-semibold text-gray-700">
      {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </span>
  );
}
