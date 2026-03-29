'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { useCheckoutStore } from '@/store/checkoutStore';

interface StepCustomerInfoProps {
  onNext: () => void;
}

export function StepCustomerInfo({ onNext }: StepCustomerInfoProps) {
  const setCustomerInfo = useCheckoutStore((s) => s.setCustomerInfo);
  const existing = useCheckoutStore((s) => s.customerInfo);

  const [name, setName] = useState(existing?.name ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  function validate(): boolean {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = 'กรุณากรอกชื่อ-นามสกุล';
    if (!email.trim()) newErrors.email = 'กรุณากรอกอีเมล';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setCustomerInfo({ name: name.trim(), email: email.trim() });
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">ข้อมูลลูกค้า</h2>
      <FormField
        id="name"
        label="ชื่อ-นามสกุล"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        placeholder="ชื่อ นามสกุล"
      />
      <FormField
        id="email"
        label="อีเมล"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="example@email.com"
      />
      <Button type="submit" size="lg" className="w-full mt-2">
        ถัดไป
      </Button>
    </form>
  );
}
