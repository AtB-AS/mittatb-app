# Using theme

Theme can be used by setting colors and general styling in `./colors.ts` and accessed directly through contexts or as a part of StyleSheets.

## API

```ts
useTheme(): {
  theme: Theme; // Get current theme properties
  updateTheme(theme: 'light' | 'dark'): void; // Set explicit theme
  toggleTheme(): void; // Toggle between light and dark
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
import {useTheme} from '.';

function MyComponent() {
  const {theme, updateTheme, toggleTheme} = useTheme();

  return (
    <View style={{backgroundColor: theme.background.primary}}>
      <Text style={{color: theme.text.primary}}>Hello</Text>
    </View>
  );
}
```

### Using StyleSheet

NB: Use custom StyleSheet.create as specified in the API section

```tsx
import {useStyle} from '.';

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
    color: theme.text.primary,
  },
}));
```
