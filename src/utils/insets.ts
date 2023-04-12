import {Insets} from 'react-native';

function all(inset: number): Insets {
  return {
    top: inset,
    bottom: inset,
    left: inset,
    right: inset,
  };
}

function symmetric(vertical: number, horizontal: number): Insets {
  return {
    top: vertical,
    bottom: vertical,
    left: horizontal,
    right: horizontal,
  };
}

export const insets = {
  all,
  symmetric,
};
