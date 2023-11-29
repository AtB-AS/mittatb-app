export function isValidEmail(email: string) {
  // Entur
  const email_re =
    /[a-zA-Z0-9æøåÆØÅ!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9æøåÆØÅ!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-æøåÆØÅ]{0,61}[a-zA-Z0-9æøåÆØÅ])?(?:\.[a-zA-Z0-9æøåÆØÅ](?:[a-zA-Z0-9-æøåÆØÅ]{0,61}[a-zA-Z0-9æøåÆØÅ])?)*/;

  // Marius
  const email_2_re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return email_re.test(String(email).toLowerCase());
}

// console.log('h ' + isValidEmail('h'));
// console.log('@ ' + isValidEmail('@'));
// console.log('ææ@h' + isValidEmail('ææ@h'));
// console.log('ææ@0' + isValidEmail('ææ@0'));
// console.log('ææ@h.no' + isValidEmail('ææ@h.no'));
// console.log('ææ@h.no2' + isValidEmail('ææ@h.no2'));
// console.log('ææ@' + isValidEmail('ææ@'));
// console.log('@.no' + isValidEmail('@.no'));
// console.log('ææ@h.no.com.se' + isValidEmail('ææ@h.no.com.se'));
// console.log(
//   'hei@gmail@outlook.com' + isValidEmail('hei@gmail@outlook.com'),
// );
// console.log(
//   'jkggjd#####!!!!!#???#+++++.///&&&&@gsgsg.22222.222.no' +
//     isValidEmail('jkggjd#####!!!!!#???#+++++.///&&&&@gsgsg.22222.222.no'),
// );
