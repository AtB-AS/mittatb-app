import firestore from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';
import {AnnouncementRaw, AnnouncementType} from './types';
import {mapToAnnouncements} from './converters';

export const useAnnouncements = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);

  useEffect(() => {
    firestore()
      .collection<AnnouncementRaw>('announcements')
      .onSnapshot(
        async (snapshot) => {
          setAnnouncements(await mapToAnnouncements(snapshot.docs));
          setIsLoading(false);
        },
        (err) => {
          console.warn(err);
          setError(err);
        },
      );
  }, []);

  return {
    isLoading,
    error,
    announcements,
  };
};
