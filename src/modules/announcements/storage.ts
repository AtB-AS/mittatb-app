import {storage} from '@atb/storage';
import {AnnouncementId} from './types';

export const DISMISSED_ANNOUNCEMENTS_KEY = '@ATB_user_dismissed_announcements';

export async function addDismissedAnnouncementInStore(id: AnnouncementId) {
  const dismissedIds = await getDismissedAnnouncementsFromStore();
  dismissedIds.push(id);
  setDismissedAnnouncementInStore(dismissedIds);
  return dismissedIds;
}

export async function getDismissedAnnouncementsFromStore() {
  const dismissedIds = await storage.get(DISMISSED_ANNOUNCEMENTS_KEY);
  return dismissedIds ? (JSON.parse(dismissedIds) as AnnouncementId[]) : [];
}

export async function setDismissedAnnouncementInStore(ids: AnnouncementId[]) {
  await storage.set(DISMISSED_ANNOUNCEMENTS_KEY, JSON.stringify(ids));
}
