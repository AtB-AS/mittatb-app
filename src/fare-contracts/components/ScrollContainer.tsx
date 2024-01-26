import {StyleSheet} from '@atb/theme';
import {PropsWithChildren} from 'react';
import {View} from 'react-native';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';

type Props = PropsWithChildren<{isRefreshing: boolean; refresh: () => void}>;

export const ScrollContainer = ({children, isRefreshing, refresh}: Props) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      >
        {children}
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1},
  scrollView: {flex: 1, padding: theme.spacings.medium},
}));
