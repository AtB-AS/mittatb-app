import {storage} from '@atb/modules/storage';

export const DISMISSED_ANNOUNCEMENTS_KEY = '@ATB_user_dismissed_announcements';

export async function addDismissedAnnouncementInStore(id: string) {
  const dismissedIds = await getDismissedAnnouncementsFromStore();
  dismissedIds.push(id);
  setDismissedAnnouncementInStore(dismissedIds);
  return dismissedIds;
}

export async function getDismissedAnnouncementsFromStore() {
  const dismissedIds = await storage.get(DISMISSED_ANNOUNCEMENTS_KEY);
  return dismissedIds ? JSON.parse(dismissedIds) : [];
}

export async function setDismissedAnnouncementInStore(ids: string[]) {
  await storage.set(DISMISSED_ANNOUNCEMENTS_KEY, JSON.stringify(ids));
}
