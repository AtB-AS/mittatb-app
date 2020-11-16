import {StyleSheet, Theme} from '../../theme';

const useListStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  separator: {
    flexGrow: 1,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background.level0,
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.small,
    borderRadius: 8,
  },
  container__marginTop: {
    marginTop: theme.spacings.medium,
  },
  baseItem: {
    padding: theme.spacings.medium,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerExpandIconGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerExpandIconGroup__text: {
    marginRight: theme.spacings.xSmall,
  },
}));
export default useListStyle;
