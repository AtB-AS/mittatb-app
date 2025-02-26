import {FullScreenView} from '@atb/components/screen-view';
import {StyleSheet} from '@atb/theme';

export type RulesBlockerProps = {};

export const RulesBlocker = ({}: RulesBlockerProps) => {
  const styles = useSheetStyle();
  return (
    <FullScreenView
      headerProps={{
        rightButton: {type: 'close', withIcon: true},
      }}
    ></FullScreenView>
  );
};

const useSheetStyle = StyleSheet.createThemeHook(() => ({
  container: {
    flex: 1,
  },
}));
