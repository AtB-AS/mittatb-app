import {
  codegenNativeComponent,
  type HostComponent,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {}

/**
 * iOS native view whose children are rendered inside a `secureTextEntry`
 * UITextField canvas, which iOS excludes from screenshots.
 */
export default codegenNativeComponent<NativeProps>('SecureView', {
  excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
