// Helper function to format currency
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

// Helper function to format large numbers
export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value);
};
