import {
  codegenNativeComponent,
  type HostComponent,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {}

export default codegenNativeComponent<NativeProps>('SecureView', {
  excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
