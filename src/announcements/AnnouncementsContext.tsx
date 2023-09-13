import {createContext, useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {AnnouncementRaw, AnnouncementType} from './types';
import {mapToAnnouncements} from './converters';

type AnnouncementsContextState = {
  announcements: AnnouncementType[];
};

const AnnouncementsContext = createContext<AnnouncementsContextState>({
  announcements: [],
});

const AnnouncementsContextProvider: React.FC = ({children}) => {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection<AnnouncementRaw>('announcements')
      .onSnapshot(
        async (snapshot) => {
          setAnnouncements(mapToAnnouncements(snapshot.docs));
        },
        (err) => {
          console.warn(err);
        },
      );
    return () => unsubscribe();
  }, []);

  return (
    <AnnouncementsContext.Provider
      value={{
        announcements,
      }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
};

export function useAnnouncementsState() {
  const context = useContext(AnnouncementsContext);
  if (context === undefined) {
    throw new Error(
      'useAnnouncementsState must be used within an AnnouncementsContextProvider',
    );
  }
  return context;
}

export {AnnouncementsContextProvider};
