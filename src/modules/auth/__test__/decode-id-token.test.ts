import {decodeIdToken} from '../id-token';

describe('decodeIdToken', () => {
  it('should decode a valid ID token', () => {
    const idToken =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3NzQ4NTAwMmYwNWJlMDI2N2VmNDU5ZjViNTEzNTMzYjVjNThjMTIiLCJ0eXAiOiJKV1QifQ.eyJhYnRfaWQiOiJBVEI6Q3VzdG9tZXJBY2NvdW50OjNmZVp0OHN0QjNjSDVSTzRFUFFINVk2V25xUjIiLCJjdXN0b21lcl9udW1iZXIiOjEwNzExNDgyLCJwcm92aWRlcl9pZCI6ImFub255bW91cyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9hdGItbW9iaWxpdHktcGxhdGZvcm0tc3RhZ2luZyIsImF1ZCI6ImF0Yi1tb2JpbGl0eS1wbGF0Zm9ybS1zdGFnaW5nIiwiYXV0aF90aW1lIjoxNzUxMDExNzc5LCJ1c2VyX2lkIjoiM2ZlWnQ4c3RCM2NINVJPNEVQUUg1WTZXbnFSMiIsInN1YiI6IjNmZVp0OHN0QjNjSDVSTzRFUFFINVk2V25xUjIiLCJpYXQiOjE3NTEwMTg0MTMsImV4cCI6MTc1MTAyMjAxMywiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6e30sInNpZ25faW5fcHJvdmlkZXIiOiJhbm9ueW1vdXMifX0.exIz89TZzq4FPWt1GD3XRTnTWPsEHPQriG31tca-tY8sOvzl7VF97BAdbh4GmJLsLHEuMgzwLNE7x5H1whPWKjZl1qFOZbX1Id4nuSde2gVOysgg4f-qiiNDVJ463rq6t8xQqLBvVUxW0sZskqkmkWZ64yV4PnX-zjdFR1zSskyB6r6_x6J-O_L_4mwApnhFVQtzrf7Q1Wzm4AK9sJvYmrFjgXotppUxD8VVm46YysAAyfPZJJCZTsRmSP0xG4fn1joMKBrk6pYpQk9HvlbjFx6iLq0ZiWBXNqWYcE1OfRncg3Rw07mEva4ZDmaALgxom5tzlZqr_aZHU84hcfWqLA';
    const decoded = decodeIdToken(idToken);
    expect(decoded).toHaveProperty('auth_time');
    expect(decoded).toHaveProperty('customer_number');
    expect(decoded).toHaveProperty('exp');
    expect(decoded?.firebase?.sign_in_provider).toBe('anonymous');
  });

  it('should return undefined for an invalid ID token', () => {
    const idToken = 'invalid.token.string';
    expect(decodeIdToken(idToken)).toBeUndefined();
  });
});
