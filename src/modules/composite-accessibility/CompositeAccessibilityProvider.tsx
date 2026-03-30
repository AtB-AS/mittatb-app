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
  parentLabels?: Partial<Record<string, string>>;
};

/**
 * Provides a composite accessibility label for a group of components. The labels are concatenated in the order of the order parameter.
 *
 * Each nested component under this Provider can contribute to the composite accessibility label by calling `useAccessibilityLabelContribution`.
 *
 * You can either pass children:
 * - As a function, in which it will receive the accessibility props as an argument which you must spread to the underlying accessible parent component.
 * - As one (or more) ReactNode(s), in which case you must retrieve the accessibility props with `useCompositeAccessibilityProps` and set them on the appropriate component.
 *
 * @param children - A function or one (or more) ReactNode(s).
 * @param order - The order of the labels to concatenate.
 * @param parentLabels - The labels which are owned by the parent component (the component using this provider).
 * @returns
 */
export const CompositeAccessibilityProvider = ({
  children,
  order,
  parentLabels,
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
    if (!parentLabels) return;
    for (const [name, label] of Object.entries(parentLabels)) {
      if (label !== undefined) {
        slots.current.set(name, label);
      } else {
        slots.current.delete(name);
      }
    }
    buildLabel();
  }, [parentLabels, buildLabel]);

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
