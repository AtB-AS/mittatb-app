/*
  NECESSITIES:
    ! Mobile token is not supported on simulators
    - Fixed phone number in staging (i.e. fixed account)
    - Account has a mobile token on a real device (to show messages about this)
    - Account has a travelcard to be able to switch
    - Account have expired tickets to check
    - Account has a stored payment card for buying tickets
 */
export const userInfo = {
  phoneNumber: '91111111',
  otp: '123456',
  customerNumber: '3577544',
  travelCardNumber: '69 2548964',
  recurringPaymentCardNumber: '**** 0004',
  user_id: 'uZt1Jkv9qfTuKO26RXi5ZVUCsZn1',
};

export const ticketInfo = {
  singleFareProductAdultPrice: 42,
  singleFareProductChildPrice: 21,
  singleFareProductZoneAZoneB1Price: 84,
  periodic180daysPrice: 4450,
  periodic30daysPrice: 890,
};
