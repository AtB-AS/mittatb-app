import {AppState, AppStateStatus} from 'react-native';
import bugsnag from './bugsnag';

function track(state: AppStateStatus) {
  bugsnag.leaveBreadcrumb('appState', {state});
}

export default function trackAppState() {
  AppState.addEventListener('change', track);
}
