import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {TransportationIconBoxList} from '@atb/components/icon-box';
import {ContentHeading} from '@atb/components/heading';
import {useFirestoreConfiguration} from '@atb/configuration';
import {useTipsAndInformationEnabled} from '@atb/tips-and-information/use-tips-and-information-enabled';
import {TipsAndInformation} from '@atb/tips-and-information';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {BenefitImage} from '@atb/mobility/components/BenefitImage';

type Props = RootStackScreenProps<'Root_TicketInformationScreen'>;

export const Root_TicketInformationScreen = (props: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyle();
  const {preassignedFareProducts, fareProductTypeConfigs} =
    useFirestoreConfiguration();
  const showTipsAndInformation = useTipsAndInformationEnabled();
  const {isLoading, benefits} = useOperatorBenefitsForFareProduct(
    props.route.params.preassignedFareProductId,
  );

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (f) => f.type === props.route.params.fareProductTypeConfigType,
  );
  const preassignedFareProduct = preassignedFareProducts.find(
    (p) => p.id === props.route.params.preassignedFareProductId,
  );

  return (
    <FullScreenView
      headerProps={{
        title: t(
          PurchaseOverviewTexts.ticketInformation.informationDetails.title,
        ),
        leftButton: {type: 'close'},
      }}
      contentColor="background_accent_0"
    >
      <ScrollView contentContainerStyle={styles.container}>
        {preassignedFareProduct?.productDescription && (
          <>
            <ContentHeading
              color="background_accent_0"
              text={t(
                PurchaseOverviewTexts.ticketInformation.informationDetails
                  .descriptionHeading,
              )}
            />
            <Section>
              <GenericSectionItem>
                {fareProductTypeConfig && (
                  <View style={styles.descriptionHeading}>
                    <TransportationIconBoxList
                      iconSize="xSmall"
                      modes={fareProductTypeConfig?.transportModes}
                    />
                    <ThemeText type="body__primary--bold">
                      {getTextForLanguage(fareProductTypeConfig.name, language)}
                    </ThemeText>
                  </View>
                )}
                <ThemeText type="body__secondary" isMarkdown={true}>
                  {getTextForLanguage(
                    preassignedFareProduct.productDescription,
                    language,
                  )}
                </ThemeText>
              </GenericSectionItem>
              {!isLoading &&
                benefits.length > 0 &&
                benefits.map((b) => (
                  <GenericSectionItem key={b.formFactor + b.ticketDescription}>
                    <View style={styles.mobilityBenefit}>
                      <BenefitImage
                        formFactor={b.formFactor}
                        eligible={false}
                      />
                      <ThemeText
                        type="body__secondary"
                        style={styles.mobilityBenefitText}
                      >
                        {getTextForLanguage(b.ticketDescription, language)}
                      </ThemeText>
                    </View>
                  </GenericSectionItem>
                ))}
            </Section>
          </>
        )}
        {showTipsAndInformation && (
          <>
            <ContentHeading
              color="background_accent_0"
              text={t(
                PurchaseOverviewTexts.ticketInformation.informationDetails
                  .tipsInformation,
              )}
            />
            <TipsAndInformation />
          </>
        )}
      </ScrollView>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      marginHorizontal: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
      rowGap: theme.spacings.small,
    },
    descriptionHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacings.small,
      flexShrink: 1,
    },
    mobilityBenefit: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: theme.spacings.medium,
    },
    mobilityBenefitText: {
      flexShrink: 1,
    },
  };
});
