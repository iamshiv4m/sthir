'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export function FormField({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {label ? <Label>{label}</Label> : null}
      {children}
    </div>
  );
}

export type FormSelectOption = {
  value: string;
  label: string;
};

export function FormSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  disabled,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const items = options.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  return (
    <Select
      value={value}
      items={items}
      disabled={disabled}
      onValueChange={(next) => {
        if (next != null) onValueChange(String(next));
      }}
    >
      <SelectTrigger
        className={cn('w-full bg-input/30 dark:bg-input/30', className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="w-[var(--anchor-width)]">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
