export interface Country {
  code: string;
  name: string;
  dial_code: string;
  currency: string;
  flag: string;
}

export const countries: Country[] = [
  { code: 'UG', name: 'Uganda', dial_code: '+256', currency: 'UGX', flag: '🇺🇬' },
  { code: 'KE', name: 'Kenya', dial_code: '+254', currency: 'KES', flag: '🇰🇪' },
  { code: 'TZ', name: 'Tanzania', dial_code: '+255', currency: 'TZS', flag: '🇹🇿' },
  { code: 'RW', name: 'Rwanda', dial_code: '+250', currency: 'RWF', flag: '🇷🇼' },
  { code: 'BI', name: 'Burundi', dial_code: '+257', currency: 'BIF', flag: '🇧🇮' },
  { code: 'NG', name: 'Nigeria', dial_code: '+234', currency: 'NGN', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', dial_code: '+233', currency: 'GHS', flag: '🇬🇭' },
  { code: 'ZA', name: 'South Africa', dial_code: '+27', currency: 'ZAR', flag: '🇿🇦' },
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return countries.find(country => country.dial_code === dialCode);
};

export const getCurrencyByCountryCode = (code: string): string => {
  const country = getCountryByCode(code);
  return country?.currency || 'UGX';
};

export const defaultCountry: Country = countries[0]; // Uganda as default