import {ParkingViolationType} from '@atb/api/types/mobility';
import {Processing} from '@atb/components/loading';
import {MessageBox} from '@atb/components/message-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ExpandableSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useViolationsReporting} from '@atb/mobility/violations-reporting/use-violations-reporting';
import {StyleSheet} from '@atb/theme';
import {isDefined} from '@atb/utils/presence';
import {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';

export const Root_ParkingViolationsReportScreen = () => {
  const styles = useStyles();
  const {isLoading, error, violations, providers} = useViolationsReporting();
  const [selectedViolations, setSelectedViolations] = useState<number[]>([]);

  const groupedViolations = violations.reduce<
    [ParkingViolationType, ParkingViolationType | undefined][]
  >((grouped, current, index, arr) => {
    if (index % 2 === 0) return [...grouped, [current, arr[index + 1]]];
    return grouped;
  }, []);

  const handleViolationSelect = (id: number) => {
    setSelectedViolations((current) =>
      current.includes(id)
        ? current.filter((it) => it !== id)
        : [...current, id],
    );
  };

  const isViolationSelected = (id: number) => selectedViolations.includes(id);

  return (
    <>
      <FullScreenHeader
        title="Rapporter feilparkering"
        leftButton={{type: 'cancel'}}
      />
      <ScrollView style={styles.container}>
        {isLoading && <Processing message={'Loading...'} />}
        {error && (
          <MessageBox
            message="Oops! Vi fikk ikke til å starte feilrapporteringen denne gangen."
            type={'error'}
          />
        )}
        {!error && !error && (
          <Section>
            <ExpandableSectionItem
              expanded={true}
              text="Hva er feil?"
              textType="body__primary--bold"
              expandContent={
                <>
                  {groupedViolations.map((violationGroup) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginBottom: 16,
                      }}
                    >
                      {violationGroup.filter(isDefined).map((violation) => (
                        <TouchableOpacity
                          onPress={() => handleViolationSelect(violation.id)}
                          style={{
                            borderRadius: 100,
                            overflow: 'hidden',
                            borderWidth: 2,
                            borderColor: isViolationSelected(violation.id)
                              ? 'green'
                              : 'transparent',
                          }}
                        >
                          <SvgXml height={80} width={80} xml={violation.icon} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </>
              }
            />
            <ExpandableSectionItem
              expanded={false}
              text="Bilde"
              textType="body__primary--bold"
              expandContent={
                <View>
                  <ThemeText>Ta bilde</ThemeText>
                </View>
              }
            />
            <ExpandableSectionItem
              expanded={false}
              text="QR-kode"
              textType="body__primary--bold"
              expandContent={
                <View>
                  <ThemeText>Ta bilde</ThemeText>
                </View>
              }
            />

            <ExpandableSectionItem
              expanded={false}
              text="Velg operatør"
              textType="body__primary--bold"
              expandContent={
                <View>
                  {providers.map((provider) => (
                    <ThemeText>{provider.name}</ThemeText>
                  ))}
                </View>
              }
            />
          </Section>
        )}
      </ScrollView>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacings.medium,
  },
}));
