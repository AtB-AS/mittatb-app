// main index.js

import { NativeModules } from 'react-native'

interface NativeBridge {
    currentTimeMillis: () => Promise<number>
    isEnabled: () => Promise<boolean>
    setEnabled: (enabled: boolean) => Promise<null>
}

export const { currentTimeMillis, isEnabled, setEnabled }: NativeBridge =
    NativeModules.BluetoothChallenge
