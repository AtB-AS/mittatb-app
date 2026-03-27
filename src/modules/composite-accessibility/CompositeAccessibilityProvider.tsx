import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {AccessibilityProps} from 'react-native';

type Registration = {update: (label: string) => void; unregister: () => void};
type RegisterFn = (name: string, label: string) => Registration;

const RegisterContext = createContext<RegisterFn | null>(null);
const LabelContext = createContext<string>('');

type ProviderProps = {
  children:
    | React.ReactNode
    | ((a11yProps: AccessibilityProps) => React.ReactNode);
  order: string[];
  ownedLabels?: Partial<Record<string, string>>;
};

export const CompositeAccessibilityProvider = ({
  children,
  order,
  ownedLabels,
}: ProviderProps) => {
  const slots = useRef(new Map<string, string>());
  const [a11yLabel, setA11yLabel] = useState('');
  const orderRef = useRef(order);

  const buildLabel = useCallback(() => {
    setA11yLabel(
      orderRef.current
        .map((name) => slots.current.get(name))
        .filter((v): v is string => v !== undefined)
        .join(', '),
    );
  }, []);

  useEffect(() => {
    orderRef.current = order;
    buildLabel();
  }, [order, buildLabel]);

  useEffect(() => {
    if (!ownedLabels) return;
    for (const [name, label] of Object.entries(ownedLabels)) {
      if (label !== undefined) {
        slots.current.set(name, label);
      } else {
        slots.current.delete(name);
      }
    }
    buildLabel();
  }, [ownedLabels, buildLabel]);

  const register = useCallback<RegisterFn>(
    (name, initialLabel) => {
      if (!orderRef.current.includes(name)) {
        console.warn(
          `CompositeAccessibilityProvider: "${name}" is not in the defined order [${orderRef.current.join(', ')}] and will not be read.`,
        );
      }
      slots.current.set(name, initialLabel);
      buildLabel();
      return {
        update(label) {
          slots.current.set(name, label);
          buildLabel();
        },
        unregister() {
          slots.current.delete(name);
          buildLabel();
        },
      };
    },
    [buildLabel],
  );

  const a11yProps: AccessibilityProps = {
    accessible: true,
    accessibilityLabel: a11yLabel,
  };

  return (
    <RegisterContext.Provider value={register}>
      <LabelContext.Provider value={a11yLabel}>
        {typeof children === 'function' ? children(a11yProps) : children}
      </LabelContext.Provider>
    </RegisterContext.Provider>
  );
};

/**
 * Returns the composed accessibility label as spreadable props.
 * Use this to make any component the accessible element.
 *
 * Must be used within a CompositeAccessibilityProvider.
 */
export const useCompositeAccessibilityProps = (): AccessibilityProps => {
  const accessibilityLabel = useContext(LabelContext);
  return {accessible: true, accessibilityLabel};
};

export const useAccessibilityLabelContribution = (
  name: string,
  label: string,
) => {
  const register = useContext(RegisterContext);

  if (!register) {
    throw new Error(
      'useAccessibilityLabelContribution must be used within a CompositeAccessibilityProvider',
    );
  }

  const regRef = useRef<Registration | null>(null);

  useEffect(() => {
    regRef.current = register(name, label);
    return () => regRef.current?.unregister();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    regRef.current?.update(label);
  }, [label]);
};
