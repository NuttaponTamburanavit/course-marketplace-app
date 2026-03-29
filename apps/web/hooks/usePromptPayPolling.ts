'use client';

import { useEffect, useRef, useState } from 'react';
import { orderApi } from '@/api/orderApi';
import type { OrderStatus } from '@/api/types';

const TERMINAL_STATUSES: OrderStatus[] = ['paid', 'access_granted', 'cancelled', 'failed'];
const MAX_ATTEMPTS = 200;
const INTERVAL_MS = 3000;

interface UsePromptPayPollingOptions {
  orderId: string;
  onSuccess: () => void;
}

interface UsePromptPayPollingResult {
  status: OrderStatus | null;
  error: string | null;
  isPolling: boolean;
}

export function usePromptPayPolling({
  orderId,
  onSuccess,
}: UsePromptPayPollingOptions): UsePromptPayPollingResult {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const attemptsRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const poll = async () => {
      attemptsRef.current += 1;
      if (attemptsRef.current > MAX_ATTEMPTS) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPolling(false);
        return;
      }
      try {
        const result = await orderApi.getOrderStatus(orderId);
        setStatus(result.status);
        setError(null);
        if (TERMINAL_STATUSES.includes(result.status)) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPolling(false);
          if (result.status === 'paid' || result.status === 'access_granted') {
            onSuccess();
          }
        }
      } catch {
        setError('กำลังตรวจสอบ...');
      }
    };

    intervalRef.current = setInterval(poll, INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [orderId, onSuccess]);

  return { status, error, isPolling };
}
