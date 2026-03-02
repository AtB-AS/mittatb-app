import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {translation as _, useTranslation} from '@atb/translations';
import React, {RefObject} from 'react';
import {View} from 'react-native';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {TripPattern} from '@atb/api/types/trips';
import {Delete} from '@atb/assets/svg/mono-icons/actions';

type Props = {
  onRemovePress: (tripPattern: TripPattern) => void;
  onClose: () => void;
  bottomSheetModalRef: RefObject<GorhomBottomSheetModal | null>;
};

export const RemoveStoredTripPatternBottomSheet = ({
  onRemovePress,
  onClose,
  bottomSheetModalRef,
}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();

  return (
    <BottomSheetModal<TripPattern>
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(RemoveStoredTripPatternBottomSheetTexts.header.text)}
      bottomSheetHeaderType={BottomSheetHeaderType.Cancel}
      closeCallback={onClose}
      fullyDismissedCallback={onClose}
    >
      {({data}) => (
        <View style={styles.container}>
          <Button
            expanded={true}
            onPress={() => data && onRemovePress(data)}
            text={t(RemoveStoredTripPatternBottomSheetTexts.removeButton.text)}
            accessibilityLabel={t(
              RemoveStoredTripPatternBottomSheetTexts.removeButton.a11yLabel,
            )}
            mode="secondary"
            backgroundColor={theme.color.interactive.destructive.default}
            leftIcon={{svg: Delete}}
          />
        </View>
      )}
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      backgroundColor: theme.color.background.neutral[1].background,
      marginHorizontal: theme.spacing.medium,
      rowGap: theme.spacing.medium,
    },
  };
});

const RemoveStoredTripPatternBottomSheetTexts = {
  header: {
    text: _('Fjern lagret reise?', 'Remove saved trip?', 'Fjern lagret reise?'),
  },
  removeButton: {
    text: _('Fjern lagret reise', 'Remove saved trip', 'Fjern lagret reise'),
    a11yLabel: _(
      'Aktiver for å fjern lagret reise',
      'Activate to remove saved trip',
      'Aktiver for å fjern lagret reise',
    ),
  },
};
