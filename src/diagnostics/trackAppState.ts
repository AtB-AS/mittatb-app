import {AppState, AppStateStatus} from 'react-native';
import Bugsnag from '@bugsnag/react-native';

function track(state: AppStateStatus) {
  Bugsnag.leaveBreadcrumb('appState', {state});
}

export default function trackAppState() {
  AppState.addEventListener('change', track);
}
