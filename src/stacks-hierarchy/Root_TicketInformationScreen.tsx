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
import {ContentHeading} from '@atb/components/content-heading';

type Props = RootStackScreenProps<'Root_TicketInformationScreen'>;

export const Root_TicketInformationScreen = (props: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyle();
  const fareProductTypeConfig = props.route.params.fareProductTypeConfig;
  const preassignedFareProduct = props.route.params.preassignedFareProduct;

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
      <ScrollView style={styles.container}>
        {preassignedFareProduct.productDescription && (
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
                <View style={styles.descriptionHeading}>
                  <TransportationIconBoxList
                    iconSize="small"
                    modes={fareProductTypeConfig.transportModes}
                  />
                  <ThemeText type="body__primary--bold">
                    {getTextForLanguage(fareProductTypeConfig.name, language)}
                  </ThemeText>
                </View>
                <ThemeText type="body__secondary" isMarkdown={true}>
                  {getTextForLanguage(
                    preassignedFareProduct.productDescription,
                    language,
                  )}
                </ThemeText>
              </GenericSectionItem>
            </Section>
          </>
        )}
      </ScrollView>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.medium,
  },
  descriptionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacings.medium,
  },
}));
