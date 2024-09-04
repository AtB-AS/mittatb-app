import {StyleSheet} from '@atb/theme';
import {ThemeText} from '../text';
import {View} from 'react-native';
import {LabelType} from '@atb/configuration';
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
      <ThemeText color="info" type="body__tertiary">
        {flagTranslated}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  flag: {
    backgroundColor: theme.color.status.info.primary.background,
    marginRight: theme.spacing.medium,
    paddingHorizontal: theme.spacing.small,
    paddingVertical: theme.spacing.xSmall,
    borderRadius: theme.border.radius.circle,
  },
}));
