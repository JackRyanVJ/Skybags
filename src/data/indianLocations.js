// Indian States & Union Territories
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
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Sample PIN code lookup helper for quick auto-fill in checkout
export const PINCODE_MAP = {
  '411001': { city: 'Pune', state: 'Maharashtra', deliveryDays: '1-2 Days (Express)' },
  '411004': { city: 'Pune', state: 'Maharashtra', deliveryDays: '1-2 Days (Express)' },
  '411014': { city: 'Pune', state: 'Maharashtra', deliveryDays: '1-2 Days (Express)' },
  '411038': { city: 'Pune', state: 'Maharashtra', deliveryDays: '1-2 Days (Express)' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', deliveryDays: '1-2 Days (Express)' },
  '400013': { city: 'Mumbai', state: 'Maharashtra', deliveryDays: '1-2 Days (Express)' },
  '400064': { city: 'Mumbai', state: 'Maharashtra', deliveryDays: '1-2 Days (Express)' },
  '400076': { city: 'Mumbai', state: 'Maharashtra', deliveryDays: '1-2 Days (Express)' },
  '110001': { city: 'New Delhi', state: 'Delhi', deliveryDays: '2-3 Days (Standard)' },
  '110017': { city: 'New Delhi', state: 'Delhi', deliveryDays: '2-3 Days (Standard)' },
  '560001': { city: 'Bengaluru', state: 'Karnataka', deliveryDays: '2-3 Days (Standard)' },
  '560038': { city: 'Bengaluru', state: 'Karnataka', deliveryDays: '2-3 Days (Standard)' },
  '560095': { city: 'Bengaluru', state: 'Karnataka', deliveryDays: '2-3 Days (Standard)' },
  '500001': { city: 'Hyderabad', state: 'Telangana', deliveryDays: '2-3 Days (Standard)' },
  '500081': { city: 'Hyderabad', state: 'Telangana', deliveryDays: '2-3 Days (Standard)' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', deliveryDays: '2-4 Days (Standard)' },
  '600002': { city: 'Chennai', state: 'Tamil Nadu', deliveryDays: '2-4 Days (Standard)' },
  '700001': { city: 'Kolkata', state: 'West Bengal', deliveryDays: '2-4 Days (Standard)' },
  '700068': { city: 'Kolkata', state: 'West Bengal', deliveryDays: '2-4 Days (Standard)' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', deliveryDays: '2-3 Days (Standard)' },
  '380015': { city: 'Ahmedabad', state: 'Gujarat', deliveryDays: '2-3 Days (Standard)' },
  '302001': { city: 'Jaipur', state: 'Rajasthan', deliveryDays: '2-4 Days (Standard)' },
  '160017': { city: 'Chandigarh', state: 'Chandigarh', deliveryDays: '2-4 Days (Standard)' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', deliveryDays: '2-3 Days (Standard)' },
  '122001': { city: 'Gurugram', state: 'Haryana', deliveryDays: '2-3 Days (Standard)' }
};

export function lookupPincode(pincode) {
  if (PINCODE_MAP[pincode]) {
    return PINCODE_MAP[pincode];
  }
  // Generic Indian PIN code fallback algorithm
  if (/^[1-9][0-9]{5}$/.test(pincode)) {
    const firstDigit = pincode[0];
    let state = 'Maharashtra';
    if (firstDigit === '1') state = 'Delhi / Northern Region';
    else if (firstDigit === '2') state = 'Uttar Pradesh / Uttarakhand';
    else if (firstDigit === '3') state = 'Gujarat / Rajasthan';
    else if (firstDigit === '4') state = 'Maharashtra / Goa / MP';
    else if (firstDigit === '5') state = 'Andhra Pradesh / Karnataka / Telangana';
    else if (firstDigit === '6') state = 'Tamil Nadu / Kerala';
    else if (firstDigit === '7') state = 'West Bengal / Odisha / North East';
    else if (firstDigit === '8') state = 'Bihar / Jharkhand';

    return {
      city: 'India Region (PIN ' + pincode + ')',
      state: state,
      deliveryDays: '3-5 Days (Pan-India Standard)'
    };
  }
  return null;
}
