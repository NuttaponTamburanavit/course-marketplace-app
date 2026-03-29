import { useState } from 'react';
import { validateThaiNationalId } from '@/utils/thaiNationalId';

export function useTaxIdValidation() {
  const [error, setError] = useState<string | undefined>();

  function validate(value: string): boolean {
    if (!validateThaiNationalId(value)) {
      setError('เลขบัตรประชาชนไม่ถูกต้อง');
      return false;
    }
    setError(undefined);
    return true;
  }

  function clear() {
    setError(undefined);
  }

  return { error, validate, clear };
}
