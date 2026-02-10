export const formatPhoneForWhatsApp = (phone: string, countryCode: string = "91"): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  
  // If it already starts with country code, use as is
  if (cleaned.startsWith(countryCode)) {
    return cleaned;
  }
  
  // Otherwise, add country code
  return `${countryCode}${cleaned}`;
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10;
};

export const formatPhoneDisplay = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

