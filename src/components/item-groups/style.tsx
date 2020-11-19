import {StyleSheet, Theme} from '../../theme';

const useListStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  separator: {
    flexGrow: 1,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.small,
    borderRadius: theme.spacings.small,
    overflow: 'hidden',
  },
  container__marginTop: {
    marginTop: theme.spacings.medium,
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
  favorite: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  favorite__text: {
    flex: 1,
  },
  favorite__emoji: {
    width: 30,
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
