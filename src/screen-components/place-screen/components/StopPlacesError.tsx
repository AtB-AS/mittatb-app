import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet} from '@atb/theme';
import {DeparturesTexts, dictionary, useTranslation} from '@atb/translations';
import {View} from 'react-native';

type Props = {
  showTimeNavigation: boolean;
  forceRefresh: () => void;
};

export function StopPlacesError({showTimeNavigation, forceRefresh}: Props) {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View
      style={[
        styles.messageBox,
        !showTimeNavigation ? styles.marginBottom : undefined,
      ]}
    >
      <MessageInfoBox
        type="error"
        message={t(DeparturesTexts.message.resultFailed)}
        onPressConfig={{
          action: forceRefresh,
          text: t(dictionary.retry),
        }}
      />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  messageBox: {
    marginHorizontal: theme.spacing.medium,
  },
  marginBottom: {
    marginBottom: theme.spacing.medium,
  },
}));
