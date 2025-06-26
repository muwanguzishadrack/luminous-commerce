interface CountryCurrencyMap {
  [key: string]: string;
}

const countryCurrencyMap: CountryCurrencyMap = {
  UG: 'UGX', // Uganda
  KE: 'KES', // Kenya
  TZ: 'TZS', // Tanzania
  RW: 'RWF', // Rwanda
  BI: 'BIF', // Burundi
  NG: 'NGN', // Nigeria
  GH: 'GHS', // Ghana
  ZA: 'ZAR', // South Africa
};

/**
 * Get currency code by country ISO code
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., 'UG', 'KE')
 * @returns Currency code (e.g., 'UGX', 'KES') or 'UGX' as default
 */
export function getCurrencyByCountryCode(countryCode: string): string {
  return countryCurrencyMap[countryCode.toUpperCase()] || 'UGX';
}

/**
 * Check if a country code is supported
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns boolean indicating if the country is supported
 */
export function isCountrySupported(countryCode: string): boolean {
  return countryCode.toUpperCase() in countryCurrencyMap;
}

/**
 * Get all supported country codes
 * @returns Array of supported country codes
 */
export function getSupportedCountries(): string[] {
  return Object.keys(countryCurrencyMap);
}