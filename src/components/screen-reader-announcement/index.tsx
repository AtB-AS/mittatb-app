import React, {useEffect} from 'react';
import {AccessibilityInfo} from 'react-native';
type AnnouncementProps = {
  message?: string;
};
const ScreenreaderAnnouncement: React.FC<AnnouncementProps> = ({
  message,
}: AnnouncementProps) => {
  useEffect(() => {
    if (message) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [message]);

  return null;
};
export default ScreenreaderAnnouncement;
