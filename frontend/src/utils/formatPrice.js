/**
 * Indian Rupee (INR) currency and localization formatter
 */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export const formatPrice = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return inrFormatter.format(amount);
};

export const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const calculateDiscount = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

export const calculateDiscountPercentage = calculateDiscount;

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const isValidIndianPhone = (phone) => {
  if (!phone) return false;
  // Clean string
  const clean = phone.replace(/[\s\-()+]/g, '');
  // Should match 10-digit number optionally prefixed with 91 or 0
  return /^(?:91|0)?[6-9]\d{9}$/.test(clean);
};

export const isValidIndianPincode = (pincode) => {
  if (!pincode) return false;
  const clean = pincode.toString().trim();
  return /^[1-9][0-9]{5}$/.test(clean);
};

export const formatIndianAddress = (addr) => {
  if (!addr) return '';
  const parts = [
    addr.houseNo,
    addr.street,
    addr.landmark ? `Near ${addr.landmark}` : '',
    addr.city,
    addr.state,
    addr.postalCode ? `PIN: ${addr.postalCode}` : '',
    addr.country || 'India'
  ].filter(Boolean);
  return parts.join(', ');
};
