import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import firestore from '@react-native-firebase/firestore';
import {AnnouncementRaw, AnnouncementType} from './types';
import {mapToAnnouncements} from './converters';
import {
  addDismissedAnnouncementInStore,
  getDismissedAnnouncementsFromStore,
  setDismissedAnnouncementInStore,
} from './storage';
import {RuleVariables, checkRules} from '@atb/modules/rule-engine';

type AnnouncementsContextState = {
  findAnnouncements: (ruleVariables?: RuleVariables) => AnnouncementType[];
  dismissAnnouncement: (announcement: AnnouncementType) => void;
  resetDismissedAnnouncements: () => void;
};

const AnnouncementsContext = createContext<AnnouncementsContextState>({
  findAnnouncements: () => [],
  dismissAnnouncement: (_: AnnouncementType) => {},
  resetDismissedAnnouncements: () => {},
});

type Props = {
  children: React.ReactNode;
};

const AnnouncementsContextProvider = ({children}: Props) => {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection<AnnouncementRaw>('announcementsV2')
      // .where('active', '==', true)
      .onSnapshot(
        async (snapshot) => {
          console.log('snapshot', snapshot);
          const dismissedIds = await getDismissedAnnouncementsFromStore();
          console.log('dismissedIds', dismissedIds);
          const allAnnouncements = mapToAnnouncements(snapshot.docs);
          console.log('allAnnouncements', allAnnouncements);
          setAnnouncements(
            allAnnouncements.filter((a) => !dismissedIds.includes(a.id)),
          );
        },
        (err) => {
          console.warn(err);
        },
      );
    return () => unsubscribe();
  }, []);

  const dismissAnnouncement = useCallback(
    (dismissedAnnouncement: AnnouncementType) => {
      addDismissedAnnouncementInStore(dismissedAnnouncement.id);
      setAnnouncements((announcements) =>
        announcements.filter((a) => a.id !== dismissedAnnouncement.id),
      );
    },
    [],
  );

  const resetDismissedAnnouncements = useCallback(() => {
    setDismissedAnnouncementInStore([]);
  }, []);

  const findAnnouncements = useCallback(
    (ruleVariables: RuleVariables = {}) => {
      return announcements;
      // return announcements.filter((announcement) => {
      //   if (announcement.rules?.length) {
      //     const passRules = checkRules(announcement.rules, ruleVariables);
      //     if (!passRules) return false;
      //   }

      //   return true;
      // });
    },
    [announcements],
  );

  return (
    <AnnouncementsContext.Provider
      value={{
        findAnnouncements,
        dismissAnnouncement,
        resetDismissedAnnouncements,
      }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
};

export function useAnnouncementsContext() {
  const context = useContext(AnnouncementsContext);
  if (context === undefined) {
    throw new Error(
      'useAnnouncementsState must be used within an AnnouncementsContextProvider',
    );
  }
  return context;
}

export {AnnouncementsContextProvider};
