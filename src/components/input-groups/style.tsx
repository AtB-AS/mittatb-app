import {StyleSheet, Theme} from '../../theme';

const useListStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  separator: {
    flexGrow: 1,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
  container: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.small,
    overflow: 'hidden',
  },
  baseItem: {
    flex: 1,
    backgroundColor: theme.background.level0,
    padding: theme.spacings.medium,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
export default useListStyle;
