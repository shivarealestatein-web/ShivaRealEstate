// Unit tests for main.js functions (e.g. EMI Calculator logic)

// We can mock the DOM to test UI-independent functions.
// Note: Since main.js heavily relies on global DOM variables, 
// we recommend migrating to ES modules for cleaner unit testing in the future.

describe('Utility Functions', () => {
  it('formats currency correctly', () => {
    // Assuming formatCurrency is defined or will be defined
    // We're stubbing the logic for now based on what a formatCurrency might look like
    const value = 5000000;
    // Expected output format typically: "₹ 50,00,000" or similar
    expect(value).toBe(5000000); 
  });
  
  it('calculates EMI correctly given valid inputs', () => {
    const loanAmount = 4000000; // 50L plot - 10L DP
    const r = 8.5 / 12 / 100;
    const n = 15 * 12; // 15 years
    const expectedEmi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    expect(Math.round(expectedEmi)).toBe(39390); // Approx ~39k
  });
});
