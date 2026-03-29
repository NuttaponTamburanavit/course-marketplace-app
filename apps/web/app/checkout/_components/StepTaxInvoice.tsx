'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useTaxIdValidation } from '@/hooks/useTaxIdValidation';
import type { InvoiceInfo } from '@/api/types';
import { cn } from '@/utils/cn';

interface StepTaxInvoiceProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepTaxInvoice({ onNext, onBack }: StepTaxInvoiceProps) {
  const setInvoiceInfo = useCheckoutStore((s) => s.setInvoiceInfo);
  const [tab, setTab] = useState<'individual' | 'company'>('individual');

  // Individual fields
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [address, setAddress] = useState('');
  const [invoiceEmail, setInvoiceEmail] = useState('');

  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const { error: nationalIdError, validate: validateNationalId } = useTaxIdValidation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    let info: InvoiceInfo;
    if (tab === 'individual') {
      if (!fullName.trim()) newErrors.fullName = 'กรุณากรอกชื่อ-นามสกุล';
      if (!validateNationalId(nationalId)) newErrors.nationalId = 'เลขบัตรประชาชนไม่ถูกต้อง';
      if (!address.trim()) newErrors.address = 'กรุณากรอกที่อยู่';
      if (!invoiceEmail.trim()) newErrors.invoiceEmail = 'กรุณากรอกอีเมล';
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      info = { type: 'individual', fullName, nationalId, address, invoiceEmail };
    } else {
      if (!companyName.trim()) newErrors.companyName = 'กรุณากรอกชื่อบริษัท';
      if (!taxId.trim()) newErrors.taxId = 'กรุณากรอกเลขประจำตัวผู้เสียภาษี';
      if (!companyAddress.trim()) newErrors.companyAddress = 'กรุณากรอกที่อยู่';
      if (!contactName.trim()) newErrors.contactName = 'กรุณากรอกชื่อผู้ติดต่อ';
      if (!contactEmail.trim()) newErrors.contactEmail = 'กรุณากรอกอีเมลผู้ติดต่อ';
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      info = { type: 'company', companyName, taxId, companyAddress, contactName, contactEmail };
    }

    setErrors({});
    setInvoiceInfo(info);
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">ข้อมูลใบกำกับภาษี</h2>
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {(['individual', 'company'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-2 text-sm font-medium transition-colors',
              tab === t
                ? 'bg-brand-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50',
            )}
          >
            {t === 'individual' ? 'บุคคลธรรมดา' : 'นิติบุคคล'}
          </button>
        ))}
      </div>

      {tab === 'individual' ? (
        <>
          <FormField
            id="fullName"
            label="ชื่อ-นามสกุล"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
          />
          <FormField
            id="nationalId"
            label="เลขบัตรประชาชน 13 หลัก"
            required
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            error={errors.nationalId ?? nationalIdError}
            maxLength={13}
            inputMode="numeric"
          />
          <FormField
            id="address"
            label="ที่อยู่"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={errors.address}
          />
          <FormField
            id="invoiceEmail"
            label="อีเมลสำหรับรับใบกำกับภาษี"
            type="email"
            required
            value={invoiceEmail}
            onChange={(e) => setInvoiceEmail(e.target.value)}
            error={errors.invoiceEmail}
          />
        </>
      ) : (
        <>
          <FormField
            id="companyName"
            label="ชื่อบริษัท"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            error={errors.companyName}
          />
          <FormField
            id="taxId"
            label="เลขประจำตัวผู้เสียภาษี 13 หลัก"
            required
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            error={errors.taxId}
            maxLength={13}
            inputMode="numeric"
          />
          <FormField
            id="companyAddress"
            label="ที่อยู่บริษัท"
            required
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            error={errors.companyAddress}
          />
          <FormField
            id="contactName"
            label="ชื่อผู้ติดต่อ"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            error={errors.contactName}
          />
          <FormField
            id="contactEmail"
            label="อีเมลผู้ติดต่อ"
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            error={errors.contactEmail}
          />
        </>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={onBack} className="flex-1">
          ย้อนกลับ
        </Button>
        <Button type="submit" className="flex-1">
          ถัดไป
        </Button>
      </div>
    </form>
  );
}
