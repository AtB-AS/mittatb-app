import {AccessibilityProps} from 'react-native';
import {CompositeAccessibilityProvider} from './CompositeAccessibilityProvider';

export const withCompositeAccessibility = <T extends AccessibilityProps>(
  Component: React.ComponentType<T>,
  order: string[],
) => {
  return function WithCompositeAccessibility(props: T): React.ReactNode {
    return (
      <CompositeAccessibilityProvider order={order}>
        {(accessibilityProps) => (
          <Component {...accessibilityProps} {...props} />
        )}
      </CompositeAccessibilityProvider>
    );
  };
};
