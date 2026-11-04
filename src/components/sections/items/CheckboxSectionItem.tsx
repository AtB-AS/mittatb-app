import React from 'react';
import {View} from 'react-native';
import {Checkbox} from '@atb/components/checkbox';
import {Tag} from '@atb/components/tag';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {LabelType} from '@atb/modules/configuration';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {TagInfoTexts} from '@atb/translations/components/TagInfo';
import {SectionItemProps} from '../types';
import {GenericClickableSectionItem} from './GenericClickableSectionItem';

type Props = SectionItemProps<{
  /** A string is shown as text, other titles are shown as they are */
  title: React.ReactNode;
  description?: string;
  /* Label will be placed by the title. "Beta", "New", etc. */
  label?: LabelType;
  isChecked: boolean;
  onPress: () => void;
  disabled?: boolean;
  /** Required when the title is not a string */
  accessibilityLabel?: string;
}>;

export const CheckboxSectionItem = ({
  title,
  description,
  label,
  isChecked,
  onPress,
  disabled,
  accessibilityLabel,
  ...props
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const defaultAccessibilityLabel = [
    typeof title === 'string' ? title : undefined,
    description,
    label ? t(TagInfoTexts.labels[label].a11y) : undefined,
  ]
    .filter(Boolean)
    .join(screenReaderPause);

  return (
    <GenericClickableSectionItem
      {...props}
      active={isChecked}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{checked: isChecked, disabled}}
      accessibilityLabel={accessibilityLabel ?? defaultAccessibilityLabel}
    >
      <View style={styles.container}>
        <Checkbox checked={isChecked} />
        <View style={styles.texts}>
          <View style={styles.titleRow}>
            <View style={styles.title}>
              {typeof title === 'string' ? (
                <ThemeText>{title}</ThemeText>
              ) : (
                title
              )}
            </View>
            {label && (
              <Tag
                labels={[t(TagInfoTexts.labels[label].text)]}
                tagType="primary"
                customStyle={styles.tag}
              />
            )}
          </View>
          {description && <ThemeText type="secondary">{description}</ThemeText>}
        </View>
      </View>
    </GenericClickableSectionItem>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: theme.spacing.medium,
  },
  texts: {
    flex: 1,
    gap: theme.spacing.small,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  title: {
    flex: 1,
  },
  tag: {
    // Prevents the tag from making the title row taller, which would move the
    // title down from the checkbox
    marginVertical: -theme.spacing.xSmall,
  },
}));
