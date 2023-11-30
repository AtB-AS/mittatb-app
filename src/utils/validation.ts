export function isValidEmail(email: string) {
  const email_re =
    /[a-zA-Z0-9æøåÆØÅ!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9æøåÆØÅ!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-æøåÆØÅ]{0,61}[a-zA-Z0-9æøåÆØÅ])?(?:\.[a-zA-Z0-9æøåÆØÅ](?:[a-zA-Z0-9-æøåÆØÅ]{0,61}[a-zA-Z0-9æøåÆØÅ])?)*/;
  return email_re.test(String(email).toLowerCase());
}
