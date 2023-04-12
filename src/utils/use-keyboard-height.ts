import {useState, useEffect} from 'react';
import {Keyboard, KeyboardEvent} from 'react-native';

export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function onKeyboardWillShow(e: KeyboardEvent) {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardWillHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const showListener = Keyboard.addListener(
      'keyboardWillShow',
      onKeyboardWillShow,
    );
    const hideListener = Keyboard.addListener(
      'keyboardWillHide',
      onKeyboardWillHide,
    );
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return keyboardHeight;
}
