import {ContrastColor} from '@atb/theme/colors';
import {Add, Delete, Edit, Feedback} from '@atb/assets/svg/mono-icons/actions';
import {Check} from '@atb/assets/svg/mono-icons/status';
import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {RadioSegments} from '@atb/components/radio';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TransportationIconBox} from '@atb/components/icon-box';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {SurfaceColorName, textNames, TextNames} from '@atb/theme/colors';
import React, {useRef, useState} from 'react';
import {Alert, Platform, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {dictionary, useTranslation} from '@atb/translations';
import {BusFill} from '@atb/assets/svg/mono-icons/transportation';
import {useFontScale} from '@atb/utils/use-font-scale';
import {useScrollBorder} from '@atb/utils/use-scroll-border';
import {
  RadioSectionItem,
  ButtonSectionItem,
  ExpandableSectionItem,
  GenericSectionItem,
  HeaderSectionItem,
  LinkSectionItem,
  LocationInputSectionItem,
  MessageSectionItem,
  Section,
  TextInputSectionItem,
  ToggleSectionItem,
  PhoneInputSectionItem,
  RadioGroupSection,
} from '@atb/components/sections';
import {ProfileScreenProps} from './navigation-types';
import {MessageInfoText} from '@atb/components/message-info-text';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {Tag} from '@atb/components/tag';
import {FilterChip} from '@atb/components/filter-chip';
import {Flash, NoFlash} from '@atb/assets/svg/mono-icons/miscellaneous';
import {Swap} from '@atb/assets/svg/mono-icons/actions';
import {Loading} from '@atb/components/loading';
import {Skeleton, SkeletonBlock} from '@atb/components/skeleton';
import {AppearanceSelection} from '@atb/theme/ThemeContext';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';
import {BottomSheetModalMethods} from '@atb/components/bottom-sheet';
import {Settings} from '@atb/assets/svg/mono-icons/profile';
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';

type DesignSystemScreenProps = ProfileScreenProps<'Profile_DesignSystemScreen'>;

export const Profile_DesignSystemScreen = ({
  navigation,
}: DesignSystemScreenProps) => {
  const styles = useStyles();
  const fontScale = useFontScale();
  const {theme, themeName} = useThemeContext();
  const {t} = useTranslation();
  const [selected, setSelected] = useState(false);
  const {onScroll, isScrolled} = useScrollBorder();

  const {appearanceSelection, setAppearanceSelection} = useThemeContext();

  const [segmentedSelection, setSegmentedSelection] = useState(0);
  const [selectedFilterChips, setSelectedFilterChips] = useState<string[]>([
    'Bus',
  ]);
  const [filterChipIconSelected, setFilterChipIconSelected] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);

  const buttons = (Object.keys(theme.color.surface) as SurfaceColorName[]).map(
    (key) => (
      <Button
        expanded={true}
        key={key}
        text={`surface ${key}`}
        surfaceColor={key}
        onPress={() => Alert.alert(theme.color.surface[key].strong.background)}
      />
    ),
  );

  const Swatch: React.FC<{color: ContrastColor; name: string}> = ({
    color,
    name,
  }) => (
    <ThemeText
      style={{
        backgroundColor: color.background,
        color: color.foreground.primary,
        padding: theme.spacing.medium,
      }}
    >
      {name} {color.foreground.primary} / {color.background}
    </ThemeText>
  );

  const backgroundSwatches = [
    ...Object.entries(theme.color.background.neutral).map(([key, color]) => {
      return (
        <Swatch
          color={color}
          name={`background neutral ${key}`}
          key={'neutral-' + key}
        />
      );
    }),
    ...Object.entries(theme.color.background.accent).map(([key, color]) => {
      return (
        <Swatch
          color={color}
          name={`background accent ${key}`}
          key={'accent-' + key}
        />
      );
    }),
  ];

  const transportSwatches = Object.entries(theme.color.transport).map(
    ([key, color]) => {
      return <Swatch color={color} name={key} key={key} />;
    },
  );

  const statusSwatches = Object.entries(theme.color.status).map(
    ([key, color]) => {
      return <Swatch color={color.primary} name={key} key={key} />;
    },
  );

  const textSwatches = Object.entries(theme.color.foreground.dynamic).map(
    ([key, color]) => {
      return (
        <Swatch
          color={{
            foreground: {
              primary: theme.color.background.neutral[0].background,
              secondary: '',
              disabled: '',
            },
            background: color,
          }}
          name={key}
          key={key}
        />
      );
    },
  );

  const radioSegmentsOptions = [
    {text: 'Option 1', onPress: () => setSegmentedSelection(0)},
    {
      text: 'Option 2',
      onPress: () => setSegmentedSelection(1),
    },
    {
      text: 'Option 3',
      onPress: () => setSegmentedSelection(2),
    },
  ];

  const surfaceColorKeys = Object.keys(
    theme.color.surface,
  ) as SurfaceColorName[];

  // @TODO: add display of static colors

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title="Design System"
        leftButton={{type: 'back'}}
        showBorder={isScrolled}
        rightButton={{
          type: 'custom',
          onPress: () => bottomSheetModalRef.current?.present(),
          text: 'Appearance',
          svg: Settings,
        }}
      />

      <ScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <Section style={styles.section}>
          <HeaderSectionItem
            text={'Current font scale: ' + fontScale.toFixed(3)}
          />
          <LinkSectionItem
            text="Fare contracts"
            onPress={() => navigation.navigate('Profile_FareContractsScreen')}
          />
        </Section>
        <Section style={styles.section}>
          <HeaderSectionItem text="Icons" />

          <GenericSectionItem>
            <View style={styles.contentContainer}>
              <ThemeIcon svg={Check} />
              <ThemeIcon svg={Check} color="info" />
              <ThemeIcon svg={Check} color="warning" />

              <ThemeIcon svg={Ticket} color="disabled" size="xSmall" />
              <ThemeIcon svg={Ticket} color="info" size="small" />
              <ThemeIcon svg={Ticket} color="error" />
              <ThemeIcon svg={Ticket} size="large" />
            </View>
            <View style={styles.contentContainer}>
              <ThemeText style={{marginRight: 12}}>
                With notification indicators:
              </ThemeText>

              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                size="xSmall"
                notification={{color: theme.color.status.valid.primary}}
              />
              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                size="small"
                notification={{color: theme.color.status.warning.primary}}
              />
              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                color="error"
                notification={{color: theme.color.status.info.primary}}
              />
              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                color="disabled"
                size="large"
                notification={{color: theme.color.status.error.primary}}
              />
            </View>
            <View style={styles.contentContainer}>
              <ThemeText style={{marginRight: 12}}>
                And notification spacing:
              </ThemeText>

              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                size="xSmall"
                notification={{
                  color: theme.color.status.valid.primary,
                  backgroundColor: theme.color.background.neutral[0],
                }}
              />
              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                size="small"
                notification={{
                  color: theme.color.status.warning.primary,
                  backgroundColor: theme.color.background.neutral[0],
                }}
              />
              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                color="error"
                notification={{
                  color: theme.color.status.info.primary,
                  backgroundColor: theme.color.background.neutral[0],
                }}
              />
              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                color="disabled"
                size="large"
                notification={{
                  color: theme.color.status.error.primary,
                  backgroundColor: theme.color.background.neutral[0],
                }}
              />
            </View>

            <View style={styles.contentContainer}>
              {Object.values(Mode).map((mode) => (
                <TransportationIconBox key={mode} mode={mode} />
              ))}
            </View>

            <View style={styles.contentContainer}>
              <TransportationIconBox mode={Mode.Bus} iconSize="xSmall" />
              <TransportationIconBox mode={Mode.Bus} iconSize="small" />
              <TransportationIconBox mode={Mode.Bus} iconSize="normal" />
              <TransportationIconBox mode={Mode.Bus} iconSize="large" />
            </View>

            <View style={styles.contentContainer}>
              <TransportationIconBox
                mode={Mode.Bicycle}
                iconSize="xSmall"
                rounded
              />
              <TransportationIconBox
                mode={Mode.Rail}
                iconSize="xSmall"
                notification={statusTypeToIcon('warning', true, themeName)}
              />
              <TransportationIconBox
                mode={Mode.Bus}
                subMode={TransportSubmode.LocalBus}
                iconSize="small"
                lineNumber="1"
              />
              <TransportationIconBox
                mode={Mode.Water}
                iconSize="normal"
                rounded={true}
                lineNumber="RE 10"
              />
              <TransportationIconBox
                mode={Mode.Car}
                iconSize="large"
                rounded
                notification={statusTypeToIcon('info', true, themeName)}
              />
              <TransportationIconBox
                mode={Mode.Rail}
                iconSize="large"
                notification={statusTypeToIcon('valid', true, themeName)}
                spacious={true}
                lineNumber="99"
              />
            </View>
          </GenericSectionItem>
        </Section>

        <Section style={styles.section}>
          <HeaderSectionItem text="Loading" />

          <GenericSectionItem>
            <ThemeText>Default</ThemeText>
            <View style={styles.contentContainer}>
              <Loading size="large" />
              <Loading size="small" />
            </View>
          </GenericSectionItem>
          <GenericSectionItem>
            <ThemeText>Custom color</ThemeText>
            <View style={styles.contentContainer}>
              {surfaceColorKeys.map((key) => (
                <React.Fragment key={key}>
                  <Loading
                    size="large"
                    donutColor={
                      theme.color.surface[key].strong.foreground.primary
                    }
                    arcColor={theme.color.surface[key].strong.background}
                  />
                  <Loading
                    size="small"
                    donutColor={
                      theme.color.surface[key].strong.foreground.primary
                    }
                    arcColor={theme.color.surface[key].strong.background}
                  />
                </React.Fragment>
              ))}
            </View>
          </GenericSectionItem>
        </Section>

        <Section style={styles.section}>
          <HeaderSectionItem text="Skeleton" />

          <GenericSectionItem>
            <ThemeText>Standalone block</ThemeText>
            <View style={styles.contentContainer}>
              <Skeleton style={styles.skeletonLine} />
            </View>
            <ThemeText>Composed skeleton</ThemeText>
            <Skeleton style={styles.skeletonCard}>
              <View style={styles.skeletonCardHeader}>
                <SkeletonBlock style={styles.skeletonTitle} />
                <SkeletonBlock style={styles.skeletonBadge} />
              </View>
              <View style={styles.skeletonRow}>
                <SkeletonBlock style={styles.skeletonPill} />
                <SkeletonBlock style={styles.skeletonPill} />
                <SkeletonBlock style={styles.skeletonPill} />
              </View>
            </Skeleton>
          </GenericSectionItem>
        </Section>

        <Section style={styles.section}>
          <HeaderSectionItem text="Message Info Box" />

          <GenericSectionItem>
            <MessageInfoBox type="info" message="This is a message" />
          </GenericSectionItem>

          <GenericSectionItem>
            <MessageInfoBox
              type="info"
              message="This is a message with title"
              title="Title"
            />
          </GenericSectionItem>

          <GenericSectionItem>
            <MessageInfoBox
              message="This is a warning"
              title="Title"
              type="warning"
            />
          </GenericSectionItem>

          <GenericSectionItem>
            <MessageInfoBox
              message="This is a success message"
              title="Title"
              type="valid"
            />
          </GenericSectionItem>

          <GenericSectionItem>
            <MessageInfoBox
              message="This is an error with retry link"
              title="Title"
              type="error"
              onPressConfig={{
                action: presser,
                text: t(dictionary.retry),
              }}
            />
          </GenericSectionItem>

          <GenericSectionItem>
            <MessageInfoBox
              type="info"
              isMarkdown={true}
              title="Markdown"
              message={`This is a message with markdown,\nSupporting **bold** and *italics*\nand special characters like ', " + æøå`}
            />
          </GenericSectionItem>

          <GenericSectionItem>
            <MessageInfoBox
              type="info"
              title="With dismiss"
              onDismiss={() => Alert.alert('Closed')}
              message="This is a message with dismiss button"
            />
          </GenericSectionItem>

          <GenericSectionItem>
            <MessageInfoBox
              type="warning"
              title="With dismiss and action"
              onDismiss={() => Alert.alert('Closed')}
              onPressConfig={{
                action: presser,
                text: 'Do action',
              }}
              message="This is a message with dismiss and action"
            />
          </GenericSectionItem>

          <GenericSectionItem>
            <MessageInfoBox
              type="error"
              title="With dismiss and link"
              onDismiss={() => Alert.alert('Closed')}
              onPressConfig={{
                url: 'https://atb.no',
                text: 'Go to atb.no',
              }}
              message="This is a message with dismiss and link"
            />
          </GenericSectionItem>

          <GenericSectionItem>
            <MessageInfoBox
              type="valid"
              isMarkdown={true}
              title="Without icon"
              noStatusIcon={true}
              message="This is a message without status icon"
            />
          </GenericSectionItem>
        </Section>
        <Section style={styles.section}>
          <HeaderSectionItem text="Message Info Text" />

          <GenericSectionItem>
            <MessageInfoText
              type="info"
              isMarkdown={true}
              message="This is a message text"
              textColor={theme.color.background.neutral[0]}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <MessageInfoText
              type="warning"
              isMarkdown={true}
              message="This is a warning text"
              textColor={theme.color.background.neutral[0]}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <MessageInfoText
              type="error"
              isMarkdown={true}
              message="This is an error text"
              textColor={theme.color.background.neutral[0]}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <MessageInfoText
              type="valid"
              isMarkdown={true}
              message="This is a valid text"
              textColor={theme.color.background.neutral[0]}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <MessageInfoText
              type="valid"
              isMarkdown={true}
              iconPosition="right"
              message="This is a text with right sided icon"
              textColor={theme.color.background.neutral[0]}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <MessageInfoText
              type="valid"
              isMarkdown={true}
              message="This is a valid **markdown** message"
              textColor={theme.color.background.neutral[0]}
            />
          </GenericSectionItem>
        </Section>

        <Section style={styles.section}>
          <ExpandableSectionItem
            text="Tag"
            showIconText={false}
            textType="heading__m"
            label="new"
            expandContent={
              <>
                <ThemeText>Regular:</ThemeText>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: theme.spacing.small,
                    gap: theme.spacing.small,
                  }}
                >
                  <Tag labels={[`primary`]} tagType="primary" />
                  <Tag labels={[`secondary`]} tagType="secondary" />
                  <Tag
                    labels={[`secondary with icon`]}
                    tagType="secondary"
                    icon={Swap}
                  />
                  <Tag labels={[`valid`]} tagType="valid" />
                  <Tag labels={[`error`]} tagType="error" />
                  <Tag labels={[`warning`]} tagType="warning" />
                  <Tag labels={[`info`]} tagType="info" />
                </View>

                <ThemeText style={{marginTop: theme.spacing.small}}>
                  Small:
                </ThemeText>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: theme.spacing.small,
                    gap: theme.spacing.small,
                  }}
                >
                  <Tag labels={[`primary`]} tagType="primary" size="small" />
                  <Tag
                    labels={[`secondary`]}
                    tagType="secondary"
                    size="small"
                  />
                  <Tag
                    labels={[`secondary with icon`]}
                    tagType="secondary"
                    icon={Swap}
                    size="small"
                  />
                  <Tag labels={[`valid`]} tagType="valid" size="small" />
                  <Tag labels={[`error`]} tagType="error" size="small" />
                  <Tag labels={[`warning`]} tagType="warning" size="small" />
                  <Tag labels={[`info`]} tagType="info" size="small" />
                </View>
              </>
            }
          />
        </Section>

        <Section style={styles.section}>
          <ExpandableSectionItem
            text="Filter Chip"
            showIconText={false}
            textType="heading__m"
            label="new"
            expandContent={
              <View style={styles.filterChipContainer}>
                <View style={styles.filterChipRow}>
                  {['Bus', 'Tram', 'Boat', 'Train'].map((text) => (
                    <FilterChip
                      key={text}
                      text={text}
                      selected={selectedFilterChips.includes(text)}
                      onPress={() =>
                        setSelectedFilterChips((prev) =>
                          prev.includes(text)
                            ? prev.filter((t) => t !== text)
                            : [...prev, text],
                        )
                      }
                    />
                  ))}
                </View>
                <ThemeText>With icon:</ThemeText>
                <View style={styles.filterChipRow}>
                  <FilterChip
                    text="Flashlight"
                    selected={filterChipIconSelected}
                    onPress={() => setFilterChipIconSelected((prev) => !prev)}
                    rightIcon={{svg: filterChipIconSelected ? Flash : NoFlash}}
                  />
                </View>
              </View>
            }
          />
        </Section>

        <Section style={styles.section}>
          <ExpandableSectionItem
            text="Buttons"
            showIconText={false}
            textType="heading__m"
            expandContent={
              <View>
                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__m"
                >
                  Primary - block - surface/accent
                </ThemeText>
                <View style={styles.buttonContainer}>
                  <Button
                    surfaceColor="accent"
                    expanded={true}
                    text="Default"
                    onPress={presser}
                    mode="primary"
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={true}
                    text="Disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__m"
                >
                  Primary - block - surface/neutral
                </ThemeText>
                <View style={styles.buttonContainer}>
                  <Button
                    expanded={true}
                    text="Default"
                    onPress={presser}
                    mode="primary"
                    surfaceColor="neutral"
                  />
                  <Button
                    expanded={true}
                    text="Disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    surfaceColor="neutral"
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__m"
                >
                  Primary - block - surface/error
                </ThemeText>
                <View style={styles.buttonContainer}>
                  <Button
                    expanded={true}
                    text="Default"
                    onPress={presser}
                    mode="primary"
                    surfaceColor="error"
                  />
                  <Button
                    expanded={true}
                    text="Disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    surfaceColor="error"
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__m"
                >
                  Secondary - block
                </ThemeText>
                <View style={styles.buttonContainer}>
                  <Button
                    surfaceColor="accent"
                    expanded={true}
                    text="Default"
                    onPress={presser}
                    mode="secondary"
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={true}
                    text="Disabled"
                    onPress={presser}
                    mode="secondary"
                    disabled={true}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__m"
                >
                  tertiary - block
                </ThemeText>
                <View style={styles.buttonContainer}>
                  <Button
                    surfaceColor="accent"
                    expanded={true}
                    text="Default"
                    onPress={presser}
                    mode="tertiary"
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={true}
                    text="Disabled"
                    onPress={presser}
                    mode="tertiary"
                    disabled={true}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__m"
                >
                  Medium button examples (surface/accent)
                </ThemeText>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    text="Primary"
                    onPress={presser}
                    mode="primary"
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    text="Primary - disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    text="Secondary"
                    onPress={presser}
                    mode="secondary"
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    text="Tertiary"
                    onPress={presser}
                    mode="tertiary"
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    text="Tertiary - disabled"
                    onPress={presser}
                    mode="tertiary"
                    disabled={true}
                    style={{margin: 4}}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__m"
                >
                  Pill button examples (surface/accent)
                </ThemeText>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    text="Primary"
                    onPress={presser}
                    mode="primary"
                    type="small"
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    text="Primary - disabled"
                    onPress={presser}
                    mode="primary"
                    type="small"
                    disabled={true}
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    text="Secondary"
                    onPress={presser}
                    mode="secondary"
                    type="small"
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    text="Tertiary"
                    onPress={presser}
                    mode="tertiary"
                    type="small"
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    text="Tertiary - disabled"
                    onPress={presser}
                    mode="tertiary"
                    type="small"
                    disabled={true}
                    style={{margin: 4}}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__m"
                >
                  With icons examples (surface/accent)
                </ThemeText>
                <Button
                  surfaceColor="accent"
                  expanded={true}
                  text="Example"
                  onPress={presser}
                  mode="primary"
                  leftIcon={{svg: Add}}
                  style={{margin: 4}}
                />
                <Button
                  surfaceColor="accent"
                  expanded={true}
                  text="Example"
                  onPress={presser}
                  mode="primary"
                  rightIcon={{
                    svg: Delete,
                    notificationColor: theme.color.status.error.primary,
                  }}
                  style={{margin: 4}}
                />
                <Button
                  surfaceColor="accent"
                  expanded={true}
                  text="Example"
                  onPress={presser}
                  mode="primary"
                  disabled={true}
                  leftIcon={{svg: Add}}
                  rightIcon={{svg: Delete}}
                  style={{margin: 4}}
                />
                <Button
                  surfaceColor="accent"
                  expanded={true}
                  text="Loading button"
                  onPress={presser}
                  mode="primary"
                  loading={true}
                  style={{margin: 4}}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}
                >
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    text="Example"
                    onPress={presser}
                    mode="primary"
                    leftIcon={{
                      svg: Add,
                      notificationColor: theme.color.status.valid.primary,
                    }}
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    onPress={presser}
                    mode="primary"
                    leftIcon={{svg: Add}}
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    onPress={presser}
                    mode="secondary"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    expanded={false}
                    onPress={presser}
                    mode="tertiary"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    text="Example"
                    onPress={presser}
                    mode="primary"
                    type="small"
                    expanded={false}
                    leftIcon={{svg: Add}}
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    text="Example"
                    onPress={presser}
                    mode="secondary"
                    type="small"
                    expanded={false}
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    surfaceColor="accent"
                    text="Example"
                    onPress={presser}
                    mode="tertiary"
                    type="small"
                    expanded={false}
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                </View>
              </View>
            }
          />
        </Section>

        <Section style={styles.section}>
          <GenericSectionItem>
            <ThemeText>Generic section item</ThemeText>
          </GenericSectionItem>
          <GenericSectionItem transparent>
            <ThemeText>Transparent generic section item</ThemeText>
          </GenericSectionItem>
          <GenericSectionItem active>
            <ThemeText>Active generic section item</ThemeText>
          </GenericSectionItem>
          <GenericSectionItem active transparent>
            <ThemeText>Active transparent generic section item</ThemeText>
          </GenericSectionItem>
        </Section>

        <Section style={styles.section}>
          <ToggleSectionItem
            text="Some short text"
            leftImage={<ThemeIcon svg={BusFill} />}
            onValueChange={() => {}}
          />
          <ToggleSectionItem
            text="Toggle with label"
            onValueChange={() => {}}
            label="new"
          />
          <RadioSectionItem
            text="Some short text and interactive color"
            selected={selected}
            onPress={() => setSelected(!selected)}
          />
          <RadioSectionItem
            text="Some very long text over here which goes over multiple lines"
            subtext="With a subtext and icon, no interactive color"
            leftIcon={BusFill}
            selected={selected}
            onPress={() => setSelected(!selected)}
          />
          <RadioSectionItem
            text="With left icon"
            selected={selected}
            onPress={() => setSelected(!selected)}
            leftIcon={BusFill}
          />
          <RadioSectionItem
            text="With right action"
            selected={selected}
            onPress={() => setSelected(!selected)}
            rightAction={{
              onPress: presser,
              icon: Delete,
            }}
          />
        </Section>

        <Section style={styles.section}>
          <LocationInputSectionItem
            label="Label"
            placeholder="My very long placeholder over here. Yes over multiple lines"
            onPress={() => {}}
          />
          <LocationInputSectionItem
            label="Label"
            placeholder="Short"
            onPress={() => {}}
          />
        </Section>

        <Section style={styles.section}>
          <ButtonSectionItem
            label="Label"
            placeholder="My very long placeholder over here. Yes over multiple lines"
            onPress={() => {}}
            icon="chevron-left"
          />

          <LinkSectionItem
            text="Disabled link"
            onPress={() => {}}
            disabled
            rightIcon={{svg: Edit}}
          />
          <LinkSectionItem
            text="Some longer text"
            onPress={() => {}}
            rightIcon={{svg: Edit}}
          />
          <LinkSectionItem
            text="Dangerous Link Item"
            subtitle="Subtitle text"
            onPress={() => {}}
            rightIcon={{svg: Delete, color: 'error'}}
          />
          <LinkSectionItem
            text="Link with *leftIcon* and **markdown**"
            leftIcon={{svg: BusFill}}
            isMarkdown
          />
          <LinkSectionItem
            text="Disabled Dangerous Link Item text"
            subtitle="Disabled Subtitle text"
            disabled={true}
            onPress={() => {}}
            rightIcon={{svg: Delete, color: 'error'}}
          />
          <LinkSectionItem text="Link with label" label="new" />
          <LinkSectionItem active text="Active link" />
        </Section>

        <Section style={styles.section}>
          <TextInputSectionItem
            label="Input"
            placeholder="My very long placeholder over here. Yes over multiple lines"
            onChangeText={() => {}}
            keyboardType="phone-pad"
            textContentType="oneTimeCode"
            showClear={true}
            inlineLabel={false}
          />

          <TextInputSectionItem
            label="Input"
            placeholder="Short placeholder"
            onChangeText={() => {}}
            keyboardType="phone-pad"
            textContentType="oneTimeCode"
            showClear={true}
            inlineLabel={false}
          />
          <PhoneInputSectionItem
            label="Phone input"
            prefix="47"
            onChangePrefix={() => {}}
            onClear={() => {}}
            showClear={true}
            errorText="Error"
          />
          <TextInputSectionItem
            label="Inline Label"
            placeholder="Placheolder"
            onChangeText={() => {}}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            inlineLabel={true}
          />
          <TextInputSectionItem
            label="Label"
            placeholder="Placeholder"
            onChangeText={() => {}}
            textContentType="oneTimeCode"
            showClear={true}
            inlineLabel={false}
            errorText="Something went wrong"
          />
        </Section>

        <Section style={styles.section}>
          <HeaderSectionItem text="Texts" />

          <GenericSectionItem>
            {textNames.map(function (t: TextNames) {
              return (
                <ThemeText typography={t} key={t}>
                  {t}
                </ThemeText>
              );
            })}
          </GenericSectionItem>
          {Platform.OS === 'android' && (
            <GenericSectionItem>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  fontSize: 24,
                  color: theme.color.background.neutral[0].foreground.primary,
                }}
              >
                Roboto Regular
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 24,
                  color: theme.color.background.neutral[0].foreground.primary,
                }}
              >
                Roboto Medium
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-SemiBold',
                  fontSize: 24,
                  color: theme.color.background.neutral[0].foreground.primary,
                }}
              >
                Roboto SemiBold
              </Text>
            </GenericSectionItem>
          )}
        </Section>

        <Section style={styles.section}>
          <HeaderSectionItem text="Message section items" />

          <MessageSectionItem
            messageType="info"
            title="Information message!"
            message="An information message with title"
          />

          <MessageSectionItem
            messageType="valid"
            message="A success message without title"
          />

          <MessageSectionItem
            messageType="warning"
            title="Warning message!"
            message="A warning message with title link"
            onPressConfig={{
              url: 'https://atb.no',
              text: 'Go to atb.no',
            }}
          />

          <MessageSectionItem
            messageType="error"
            message="An error message without title and with action"
            onPressConfig={{
              action: presser,
              text: t(dictionary.retry),
            }}
          />
        </Section>

        <View style={styles.section}>
          <View style={styles.buttonContainer}>{buttons}</View>
        </View>

        <View style={styles.swatchGroup}>{backgroundSwatches}</View>
        <View style={styles.swatchGroup}>{transportSwatches}</View>
        <View style={styles.swatchGroup}>{statusSwatches}</View>
        <View style={styles.swatchGroup}>
          <ThemeText>Text colors:</ThemeText>
          {textSwatches}
        </View>

        <View style={{margin: theme.spacing.medium}}>
          <ThemeText>Segmented controls:</ThemeText>
          <RadioSegments
            activeIndex={segmentedSelection}
            style={styles.radioSegments}
            options={radioSegmentsOptions}
          />
        </View>
      </ScrollView>
      <BottomSheetModal
        heading="Appearance"
        bottomSheetModalRef={bottomSheetModalRef}
        bottomSheetHeaderType={BottomSheetHeaderType.Close}
      >
        <Section style={styles.section}>
          <HeaderSectionItem text="Theme" />
          <RadioGroupSection<AppearanceSelection>
            items={[
              AppearanceSelection.SYSTEM,
              AppearanceSelection.LIGHT,
              AppearanceSelection.DARK,
            ]}
            itemToText={(item) => {
              switch (item) {
                case AppearanceSelection.SYSTEM:
                  return 'System';
                case AppearanceSelection.LIGHT:
                  return 'Light';
                case AppearanceSelection.DARK:
                  return 'Dark';
              }
            }}
            selected={appearanceSelection}
            keyExtractor={(item) => item}
            onSelect={(selection) => setAppearanceSelection(selection)}
          />
        </Section>
      </BottomSheetModal>
    </View>
  );
};

function presser() {
  Alert.alert('Heyo');
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[1].background,
    flex: 1,
  },
  buttonContainer: {
    gap: theme.spacing.small,
  },
  contentContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.small,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  section: {
    marginTop: theme.spacing.large,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  radioSegments: {
    marginTop: theme.spacing.small,
  },
  swatchGroup: {
    margin: theme.spacing.medium,
  },
  filterChipContainer: {
    gap: theme.spacing.small,
  },
  filterChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.small,
  },
  skeletonLine: {
    width: 120,
    height: 16,
    borderRadius: theme.border.radius.small,
  },
  skeletonCard: {
    gap: theme.spacing.medium,
    backgroundColor: theme.color.background.neutral[0].background,
    padding: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
  },
  skeletonCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonTitle: {
    width: 140,
    height: 18,
    borderRadius: theme.border.radius.small,
  },
  skeletonBadge: {
    width: 48,
    height: 18,
    borderRadius: theme.border.radius.small,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
  },
  skeletonPill: {
    width: 56,
    height: 32,
    borderRadius: theme.border.radius.circle,
  },
}));
