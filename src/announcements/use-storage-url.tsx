import storage from '@react-native-firebase/storage';
import {useEffect, useState} from 'react';

export const useStorageUrl = (path: string) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    storage().ref(path).getDownloadURL().then(setUrl);
  }, [path]);

  return url;
};
