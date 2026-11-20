output.profile = {
  homeScrollView: 'profileHomeScrollView',
  debugButton: 'debugButton',
  logOut: 'logoutButton',
  settings: 'settingsButton',
  notifications: 'notificationsButton',
  notificationToggle: notificationToggle,
  tokenToggle: 'travelTokenButton',
};

function notificationToggle(type) {
  return type + 'Toggle';
}
