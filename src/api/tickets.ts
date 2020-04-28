import uuid from 'uuid/v4';

export async function reserve(customerRef: string) {
  console.warn(
    'Unimplemented reserve endpoint. Customer reference: ' + customerRef,
  );

  return {
    transactionId: uuid(),
  };
}

export async function capture(customerRef: string, transactionId: string) {
  console.warn(
    'Unimplemented capture endpoint. Customer reference: ' +
      customerRef +
      ' transaction id: ' +
      transactionId,
  );

  return {};
}
