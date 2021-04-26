import React, {useEffect} from 'react';
import {AccessibilityInfo} from 'react-native';
type AnnouncementProps = {
  message?: string;
};
const ScreenReaderAnnouncement: React.FC<AnnouncementProps> = ({
  message,
}: AnnouncementProps) => {
  useScreenReaderAnnouncement(message);
  return null;
};

export const useScreenReaderAnnouncement = (
  message?: string,
  enabled: boolean = true,
) => {
  useEffect(() => {
    if (message && enabled) {
      setTimeout(
        () => AccessibilityInfo.announceForAccessibility(message),
        100,
      );
    }
  }, [message, enabled]);
};

export default ScreenReaderAnnouncement;
