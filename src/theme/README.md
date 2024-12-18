# Using theme

Theme can be used by setting colors and general styling in `./colors.ts` and accessed directly through contexts or as a part of StyleSheets.

## API

```ts
useTheme(): {
  theme: Theme; // Get current theme properties

  themeName: Mode; // Active theme name.

  // Settings in preferences.
  storedColorScheme: Mode;
  overrideSystemAppearance: boolean;

  // Will update stored preferences (persistant storage)
  updateThemePreference(theme: 'light' | 'dark'): void;
  overrideOSThemePreference(override: boolean): void;
}

StyleSheet.create(Object): Object; // Same as React Native StyleSheet.create

// Must be used with `useStyle`
StyleSheet.createTheme((theme:Theme) => Object): (theme:Theme) => Object; // Same as React Native StyleSheet.create but with access to theme

// Add theme data to StyleSheet.create generated style form above. See example
useStyle(StyleSheet): StyleSheet
```

## Examples

```tsx
// Referring to themes and set theme
import {useTheme} from '@atb/theme';

function MyComponent() {
  const {theme, updateTheme, toggleTheme} = useTheme();

  return (
    <View style={{backgroundColor: theme.background.primary}}>
      <Text style={{color: theme.color.foreground.dynamic.primary}}>Hello</Text>
    </View>
  );
}
```

### Using StyleSheet

NB: Use custom StyleSheet.create as specified in the API section

```tsx
import {useStyle} from '@atb/theme';

export default function MyComponent() {
  const css = useStyle(style);

  return (
    <View style={css.container}>
      <Text style={css.text}>Hello</Text>
    </View>
  );
}

const style = StyleSheet.createTheme((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.color.foreground.dynamic.primary,
  },
}));
```

Optionally shorthand API for using the `useStyle` is if you use `StyleSheet.createThemeHook` function:

```tsx
import {StyleSheet} from '@atb/theme';

export default function MyComponent() {
  const styles = useThemeStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.color.foreground.dynamic.primary,
  },
}));
```
