import React, {useState} from 'react';
import {View} from 'react-native';
import {isErrorResponse} from '@atb/api/utils';
import {StyleSheet} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {TextInputSectionItem} from '@atb/components/sections';
import {useAcceptTicketTransferMutation} from '@atb/modules/ticketing';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {useThemeContext} from '@atb/theme';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';

type Props = {
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
  onCloseFocusRef: React.RefObject<View | null>;
  onTicketsReceived: () => void;
};

export const TransferCodeBottomSheet = ({
  bottomSheetModalRef,
  onCloseFocusRef,
  onTicketsReceived,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const [code, setCode] = useState('');
  const {mutate, isPending, error, reset} = useAcceptTicketTransferMutation();

  const onSubmit = () =>
    mutate(code.trim(), {
      onSuccess: () => {
        bottomSheetModalRef.current?.dismiss();
        onTicketsReceived();
      },
    });

  const errorText = error
    ? isErrorResponse(error) && error.http.code === 404
      ? t(TicketingTexts.transferCode.errorNotFound)
      : t(TicketingTexts.transferCode.errorGeneric)
    : undefined;

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(TicketingTexts.transferCode.heading)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      closeCallback={() => {
        giveFocus(onCloseFocusRef);
        setCode('');
        reset();
      }}
      testID="transferCodeBottomSheet"
    >
      <View style={styles.container}>
        <Section>
          <GenericSectionItem>
            <View style={styles.infoContainer}>
              <View style={styles.infoText}>
                <ThemeText typography="body__m__strong">
                  {t(TicketingTexts.transferCode.infoTitle)}
                </ThemeText>
                <ThemeText typography="body__s" type="secondary">
                  {t(TicketingTexts.transferCode.infoBody)}
                </ThemeText>
              </View>
            </View>
          </GenericSectionItem>
        </Section>
        <Section>
          <TextInputSectionItem
            label={t(TicketingTexts.transferCode.inputLabel)}
            inlineLabel={false}
            value={code}
            onChangeText={(newCode) => {
              setCode(newCode);
              if (error) reset();
            }}
            showClear={true}
            autoCapitalize="none"
            autoCorrect={false}
            errorText={errorText}
            testID="transferCodeInput"
          />
        </Section>
        <Button
          expanded={true}
          interactiveColor={theme.color.interactive[0]}
          text={t(TicketingTexts.transferCode.submit)}
          onPress={onSubmit}
          disabled={!code.trim()}
          loading={isPending}
          testID="transferCodeSubmitButton"
        />
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    gap: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.large,
  },
  infoText: {
    flex: 1,
    gap: theme.spacing.xSmall,
  },
}));
