import {StyleSheet} from '@atb/theme';
import {ThemeText} from '../text';
import {View} from 'react-native';
import {LabelType} from '@atb-as/config-specs';
import {useTranslation} from '@atb/translations';
import {LabelInfoTexts} from '@atb/translations/components/LabelInfo';

export type LabelInfoProps = {
  label: LabelType;
};

export const LabelInfo = ({label}: LabelInfoProps) => {
  const {t} = useTranslation();
  const linkSectionItemStyle = useStyles();

  const flagTranslated = t(LabelInfoTexts.labels[label]);

  if (!flagTranslated) {
    return null;
  }

  return (
    <View style={linkSectionItemStyle.flag}>
      <ThemeText color="background_accent_3" type="body__tertiary">
        {flagTranslated}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  flag: {
    backgroundColor: theme.static.background.background_accent_3.background,
    marginRight: theme.spacings.medium,
    paddingHorizontal: theme.spacings.small,
    paddingVertical: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
  },
}));
