import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {translation as _, useTranslation} from '@atb/translations';
import React, {RefObject, useCallback} from 'react';
import {View} from 'react-native';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {TripPattern} from '@atb/api/types/trips';

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

  const onCancelPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, [bottomSheetModalRef]);

  return (
    <BottomSheetModal<TripPattern>
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(RemoveStoredTripPatternBottomSheetTexts.header.text)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      closeCallback={onClose}
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
          />
          <Button
            expanded={true}
            mode="secondary"
            text={t(
              RemoveStoredTripPatternBottomSheetTexts.doNotRemoveButton.text,
            )}
            onPress={onCancelPress}
            backgroundColor={theme.color.background.neutral[1]}
            accessibilityLabel={t(
              RemoveStoredTripPatternBottomSheetTexts.doNotRemoveButton
                .a11yLabel,
            )}
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
    text: _('Fjern reise', 'Remove trip', 'Fjern reise'),
    a11yLabel: _(
      'Aktiver for å fjern reise',
      'Activate to remove trip',
      'Aktiver for å fjern reise',
    ),
  },
  doNotRemoveButton: {
    text: _('Ikke fjern', 'Do not remove', 'Ikke fjern'),
    a11yLabel: _(
      'Aktiver for å avbryte fjerning av reise',
      'Activate to cancel removal of trip',
      'Aktiver for å avbryte fjerning av reise',
    ),
  },
};
