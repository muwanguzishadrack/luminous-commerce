import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { countries, Country } from '@/constants/countries';

interface SimpleCountrySelectorProps {
  value?: string;
  onChange: (country: Country) => void;
  placeholder?: string;
  className?: string;
}

export function SimpleCountrySelector({
  value,
  onChange,
  placeholder = 'Select country...',
  className,
}: SimpleCountrySelectorProps) {

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = event.target.value;
    const country = countries.find(c => c.code === selectedCode);
    if (country) {
      onChange(country);
    }
  };

  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={handleSelectChange}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.name} ({country.dial_code})
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  );
}