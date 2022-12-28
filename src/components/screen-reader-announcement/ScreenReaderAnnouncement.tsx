import React from 'react';
import {useScreenReaderAnnouncement} from './use-screen-reader-announcement';

type AnnouncementProps = {
  message?: string;
};

export const ScreenReaderAnnouncement: React.FC<AnnouncementProps> = ({
  message,
}: AnnouncementProps) => {
  useScreenReaderAnnouncement(message);
  return null;
};
