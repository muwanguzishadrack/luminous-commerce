import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countries, Country } from '@/constants/countries';

interface CountrySelectProps {
  value?: string;
  onChange: (country: Country) => void;
  placeholder?: string;
  className?: string;
}

export function CountrySelect({
  value,
  onChange,
  placeholder = 'Select country...',
  className,
}: CountrySelectProps) {
  const selectedCountry = countries.find((country) => country.code === value);

  const handleValueChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      onChange(country);
    }
  };

  return (
    <Select value={value || ''} onValueChange={handleValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {selectedCountry && (
            <div className="flex items-center justify-between w-full">
              <span className="text-lg">{selectedCountry.flag}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-40">
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center gap-2 w-full">
              <span>{country.flag}</span>
              <span className="flex-1">{country.name}</span>
              <span className="text-muted-foreground text-xs ml-auto">
                {country.dial_code}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}