import {Linking} from 'react-native';

/**
 * The URL the app was cold started with, captured when this module is first
 * imported. This prevents the link from being lost during slow starts.
 */
export const initialUrl = Linking.getInitialURL().catch(() => null);
