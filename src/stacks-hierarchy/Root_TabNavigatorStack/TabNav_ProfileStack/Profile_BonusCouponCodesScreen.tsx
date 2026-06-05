import React, {useMemo} from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {BonusProgramTexts, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {ThemeText} from '@atb/components/text';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {TransportationIconBox} from '@atb/components/icon-box';
import {Loading} from '@atb/components/loading';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ThemedBonusTransaction, ThemedBonusBag} from '@atb/theme/ThemedAssets';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {formatToDate} from '@atb/utils/date';
import {BonusVoucher, useBonusVouchersQuery} from '@atb/modules/bonus';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {getTransportModeAndSubMode} from '@atb/modules/mobility';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {startOfDay} from 'date-fns';
import {ProfileScreenProps} from './navigation-types';
import {ClickableCopy} from './components/ClickableCopy';

type Props = ProfileScreenProps<'Profile_BonusCouponCodesScreen'>;

type VoucherSection = {
  date: number;
  data: BonusVoucher[];
};

export const Profile_BonusCouponCodesScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad(navigation);
  const {t} = useTranslation();
  const styles = useStyles();
  const {data: vouchers, isLoading, isError, refetch} = useBonusVouchersQuery();

  const sections = useMemo<VoucherSection[]>(() => {
    if (!vouchers) return [];
    const sorted = [...vouchers].sort(
      (a, b) =>
        new Date(b.claimDate).getTime() - new Date(a.claimDate).getTime(),
    );

    const result: VoucherSection[] = [];
    let currentSection: VoucherSection | null = null;
    for (const voucher of sorted) {
      const date = startOfDay(new Date(voucher.claimDate)).getTime();
      if (!currentSection || currentSection.date !== date) {
        currentSection = {date, data: []};
        result.push(currentSection);
      }
      currentSection.data.push(voucher);
    }
    return result;
  }, [vouchers]);

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(BonusProgramTexts.myCouponCodes.title),
        leftButton: {type: 'back'},
      }}
      headerContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(BonusProgramTexts.myCouponCodes.title)}
        />
      )}
    >
      <View style={styles.container}>
        {isLoading ? (
          <Loading size="large" />
        ) : isError ? (
          <View style={styles.message}>
            <MessageInfoBox
              type="error"
              message={t(BonusProgramTexts.myCouponCodes.errorMessage)}
            />
            <Button
              expanded
              style={styles.retryButton}
              text={t(BonusProgramTexts.myCouponCodes.retry)}
              onPress={() => refetch()}
            />
          </View>
        ) : sections.length === 0 ? (
          <>
            <EmptyState />
            <HowItWorksCard />
          </>
        ) : (
          <>
            {sections.map((section) => (
              <View key={section.date} style={styles.voucherSection}>
                <VoucherSectionHeading date={section.date} />
                {section.data.map((voucher) => (
                  <VoucherCard
                    key={`${voucher.claimDate}-${voucher.code}`}
                    voucher={voucher}
                  />
                ))}
              </View>
            ))}
            <HowItWorksCard />
          </>
        )}
      </View>
    </FullScreenView>
  );
};

const EmptyState = () => {
  const {t} = useTranslation();
  const styles = useStyles();
  return (
    <View style={styles.emptyState}>
      <ThemedBonusTransaction height={120} width={120} />
      <ThemeText typography="heading__m" style={styles.emptyTitle}>
        {t(BonusProgramTexts.myCouponCodes.emptyTitle)}
      </ThemeText>
      <ThemeText
        typography="body__m"
        type="secondary"
        style={styles.emptySubtitle}
      >
        {t(BonusProgramTexts.myCouponCodes.emptyState)}
      </ThemeText>
    </View>
  );
};

const HowItWorksCard = () => {
  const {t} = useTranslation();
  const styles = useStyles();
  return (
    <Section style={styles.howItWorksSection}>
      <GenericSectionItem>
        <View style={styles.horizontalContainer}>
          <View style={styles.howItWorksText}>
            <ThemeText typography="body__m__strong">
              {t(BonusProgramTexts.myCouponCodes.howItWorksTitle)}
            </ThemeText>
            <ThemeText typography="body__s" type="secondary">
              {t(BonusProgramTexts.myCouponCodes.howItWorksBody)}
            </ThemeText>
          </View>
          <ThemedBonusBag height={60} width={60} />
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const VoucherSectionHeading = ({date}: {date: number}) => {
  const {language} = useTranslation();
  const styles = useStyles();
  return (
    <ThemeText
      typography="body__s"
      type="secondary"
      style={styles.sectionHeading}
    >
      {formatToDate(new Date(date), language)}
    </ThemeText>
  );
};

const VoucherCard = ({voucher}: {voucher: BonusVoucher}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {mobilityOperators} = useFirestoreConfigurationContext();

  const operator = mobilityOperators?.find((op) => op.id === voucher.operator);
  const formFactor = operator?.formFactors[0] as FormFactor | undefined;
  const {mode, subMode} = getTransportModeAndSubMode(formFactor);
  const modeName = formFactor
    ? t(MobilityTexts.vehicleName(formFactor))
    : (operator?.name ?? voucher.operator);

  return (
    <Section>
      <GenericSectionItem>
        <View style={styles.cardRow}>
          <View style={styles.cardInfo}>
            <TransportationIconBox mode={mode} subMode={subMode} rounded />
            <View style={styles.cardText} accessible={true}>
              <ThemeText typography="body__s__strong">{modeName}</ThemeText>
              <ThemeText typography="body__s" type="secondary">
                {operator?.name ?? voucher.operator}
              </ThemeText>
            </View>
          </View>
          <View style={styles.cardCode}>
            <ThemeText typography="body__s__strong">{voucher.code}</ThemeText>
            <ClickableCopy
              copyContent={voucher.code}
              accessibilityLabel={t(BonusProgramTexts.myCouponCodes.copy)}
              successElement={
                <>
                  <ScreenReaderAnnouncement
                    message={t(BonusProgramTexts.myCouponCodes.copied)}
                  />

                  <View style={styles.copyButton}>
                    <ThemeText typography="body__s">
                      {t(BonusProgramTexts.myCouponCodes.copied)}
                    </ThemeText>
                  </View>
                </>
              }
            >
              <View style={styles.copyButton}>
                <ThemeText typography="body__s">
                  {t(BonusProgramTexts.myCouponCodes.copy)}
                </ThemeText>
              </View>
            </ClickableCopy>
          </View>
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    gap: theme.spacing.medium,
    margin: theme.spacing.medium,
    marginTop: 0,
  },
  message: {
    rowGap: theme.spacing.small,
  },
  retryButton: {
    marginTop: theme.spacing.small,
  },
  emptyState: {
    alignItems: 'center',
    gap: theme.spacing.medium,
    paddingVertical: theme.spacing.xLarge,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.large,
  },
  howItWorksSection: {
    marginTop: theme.spacing.large,
  },
  howItWorksText: {
    flex: 1,
    gap: theme.spacing.xSmall,
  },
  voucherSection: {
    gap: theme.spacing.xSmall,
  },
  sectionHeading: {
    marginTop: theme.spacing.small,
    marginLeft: theme.spacing.medium,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.medium,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
    flex: 1,
  },
  cardText: {
    flex: 1,
  },
  cardCode: {
    alignItems: 'center',
    gap: theme.spacing.medium,
    flexDirection: 'row',
  },
  copyButton: {
    borderRadius: theme.border.radius.circle,
    borderWidth: theme.border.width.slim,
    borderColor: theme.color.background.neutral[2].foreground.primary,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.xSmall,
  },
}));
