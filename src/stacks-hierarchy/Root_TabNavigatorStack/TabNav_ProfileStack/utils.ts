import {isDate} from 'lodash';
import {Alert} from 'react-native';

type destructiveAlertProps = {
  alertTitleString: string;
  alertMessageString?: string;
  cancelAlertString: string;
  confirmAlertString: string;
  destructiveArrowFunction: () => void;
};

export const destructiveAlert = ({
  alertTitleString,
  alertMessageString,
  cancelAlertString,
  confirmAlertString,
  destructiveArrowFunction,
}: destructiveAlertProps): void =>
  Alert.alert(alertTitleString, alertMessageString, [
    {
      text: cancelAlertString,
      style: 'cancel',
    },
    {
      text: confirmAlertString,
      style: 'destructive',
      onPress: destructiveArrowFunction,
    },
  ]);

export class FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;

  static now() {
    return FirestoreTimestamp.fromMillis(Date.now());
  }

  static fromDate(date: Date) {
    if (!isDate(date)) {
      throw new Error(
        "firebase.firestore.Timestamp.fromDate(*) 'date' expected a valid Date object.",
      );
    }

    return FirestoreTimestamp.fromMillis(date.getTime());
  }

  static fromMillis(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000);
    const nanoseconds = (milliseconds - seconds * 1000) * 1e6;
    return new FirestoreTimestamp(seconds, nanoseconds);
  }

  constructor(seconds: number, nanoseconds: number) {
    this._seconds = seconds;
    this._nanoseconds = nanoseconds;
  }

  get seconds() {
    return this._seconds;
  }

  get nanoseconds() {
    return this._nanoseconds;
  }

  isEqual(other: FirestoreTimestamp) {
    if (!(other instanceof FirestoreTimestamp)) {
      throw Error(
        "firebase.firestore.Timestamp.isEqual(*) 'other' expected an instance of Timestamp.",
      );
    }

    return (
      other.seconds === this._seconds && other.nanoseconds === this._nanoseconds
    );
  }

  toDate() {
    return new Date(this.toMillis());
  }

  toMillis() {
    return this._seconds * 1000 + this._nanoseconds / 1e6;
  }

  toString() {
    return `FirestoreTimestamp(seconds=${this.seconds}, nanoseconds=${this.nanoseconds})`;
  }

  toJSON() {
    return {seconds: this.seconds, nanoseconds: this.nanoseconds};
  }

  /**
   * Converts this object to a primitive string, which allows Timestamp objects to be compared
   * using the `>`, `<=`, `>=` and `>` operators.
   */
  valueOf() {
    const MIN_SECONDS = -62135596800;

    // This method returns a string of the form <seconds>.<nanoseconds> where <seconds> is
    // translated to have a non-negative value and both <seconds> and <nanoseconds> are left-padded
    // with zeroes to be a consistent length. Strings with this format then have a lexiographical
    // ordering that matches the expected ordering. The <seconds> translation is done to avoid
    // having a leading negative sign (i.e. a leading '-' character) in its string representation,
    // which would affect its lexiographical ordering.
    const adjustedSeconds = this.seconds - MIN_SECONDS;
    // Note: Up to 12 decimal digits are required to represent all valid 'seconds' values.
    const formattedSeconds = String(adjustedSeconds).padStart(12, '0');
    const formattedNanoseconds = String(this.nanoseconds).padStart(9, '0');
    return formattedSeconds + '.' + formattedNanoseconds;
  }
}
