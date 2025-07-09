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
import {InteractiveColor, textNames, TextNames} from '@atb/theme/colors';
import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {dictionary, useTranslation} from '@atb/translations';
import {Bus} from '@atb/assets/svg/mono-icons/transportation';
import {useFontScale} from '@atb/utils/use-font-scale';
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
} from '@atb/components/sections';
import {ProfileScreenProps} from './navigation-types';
import {MessageInfoText} from '@atb/components/message-info-text';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {Tag} from '@atb/components/tag';
import {Swap} from '@atb/assets/svg/mono-icons/actions';

type DesignSystemScreenProps = ProfileScreenProps<'Profile_DesignSystemScreen'>;

export const Profile_DesignSystemScreen = ({
  navigation,
}: DesignSystemScreenProps) => {
  const styles = useStyles();
  const fontScale = useFontScale();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const [selected, setSelected] = useState(false);

  const [segmentedSelection, setSegmentedSelection] = useState(0);

  const buttons = Object.entries(theme.color.interactive).map(
    ([key, color]) => (
      <Button
        expanded={true}
        key={key}
        text={`interactive ${key}`}
        onPress={() => Alert.alert(color.default.background)}
        interactiveColor={color as InteractiveColor}
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
        <Swatch color={color} name={`background neutral ${key}`} key={key} />
      );
    }),
    ...Object.entries(theme.color.background.accent).map(([key, color]) => {
      return (
        <Swatch color={color} name={`background accent ${key}`} key={key} />
      );
    }),
  ];

  const transportSwatches = Object.entries(theme.color.transport).map(
    ([key, color]) => {
      return <Swatch color={color.primary} name={key} key={key} />;
    },
  );
  const secondaryTransportSwatches = Object.entries(theme.color.transport).map(
    ([key, color]) => {
      return <Swatch color={color.secondary} name={key} key={key} />;
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
      subtext: 'Subtext',
    },
  ];

  const radioSegments = Object.entries(theme.color.interactive).map(
    ([key, color]) => (
      <RadioSegments
        key={key}
        activeIndex={segmentedSelection}
        style={{
          marginTop: theme.spacing.small,
        }}
        color={color as InteractiveColor}
        options={radioSegmentsOptions}
      />
    ),
  );

  // @TODO: add display of static colors

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title="Design System"
        leftButton={{type: 'back'}}
        rightButton={{type: 'chat'}}
      />

      <ScrollView>
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
            <View style={styles.icons}>
              <ThemeIcon svg={Check} />
              <ThemeIcon svg={Check} color="info" />
              <ThemeIcon svg={Check} color="warning" />

              <ThemeIcon svg={Ticket} color="disabled" size="xSmall" />
              <ThemeIcon svg={Ticket} color="info" size="small" />
              <ThemeIcon svg={Ticket} color="error" />
              <ThemeIcon svg={Ticket} size="large" />
            </View>
            <View style={styles.icons}>
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
            <View style={styles.icons}>
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
            <View style={styles.icons}>
              <TransportationIconBox
                style={styles.transportationIcon}
                mode={Mode.Bus}
                subMode={TransportSubmode.LocalBus}
              />
              {Object.values(Mode).map((mode) => (
                <TransportationIconBox
                  key={mode}
                  style={styles.transportationIcon}
                  mode={mode}
                />
              ))}
            </View>
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
            textType="heading__title"
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
            text="Buttons"
            showIconText={false}
            textType="heading__title"
            expandContent={
              <View>
                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__paragraph"
                >
                  Primary - block - interactive/0
                </ThemeText>
                <View style={styles.buttonContainer}>
                  <Button
                    expanded={true}
                    text="Default"
                    onPress={presser}
                    mode="primary"
                    interactiveColor={theme.color.interactive[0]}
                  />
                  <Button
                    expanded={true}
                    text="Active"
                    onPress={presser}
                    mode="primary"
                    active={true}
                    interactiveColor={theme.color.interactive[0]}
                  />
                  <Button
                    expanded={true}
                    text="Disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    interactiveColor={theme.color.interactive[0]}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__paragraph"
                >
                  Primary - block - interactive/1
                </ThemeText>
                <View style={styles.buttonContainer}>
                  <Button
                    expanded={true}
                    text="Default - block"
                    onPress={presser}
                    mode="primary"
                    interactiveColor={theme.color.interactive[1]}
                  />
                  <Button
                    expanded={true}
                    text="Active"
                    onPress={presser}
                    mode="primary"
                    active={true}
                    interactiveColor={theme.color.interactive[1]}
                  />
                  <Button
                    expanded={true}
                    text="Disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    interactiveColor={theme.color.interactive[1]}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__paragraph"
                >
                  Primary - block - interactive/2
                </ThemeText>
                <View style={styles.buttonContainer}>
                  <Button
                    expanded={true}
                    text="Default"
                    onPress={presser}
                    mode="primary"
                    interactiveColor={theme.color.interactive[2]}
                  />
                  <Button
                    expanded={true}
                    text="Active"
                    onPress={presser}
                    mode="primary"
                    active={true}
                    interactiveColor={theme.color.interactive[2]}
                  />
                  <Button
                    expanded={true}
                    text="Disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    interactiveColor={theme.color.interactive[2]}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__paragraph"
                >
                  Primary - block - interactive/destructive
                </ThemeText>
                <View style={styles.buttonContainer}>
                  <Button
                    expanded={true}
                    text="Default"
                    onPress={presser}
                    mode="primary"
                    interactiveColor={theme.color.interactive.destructive}
                  />
                  <Button
                    expanded={true}
                    text="Active"
                    onPress={presser}
                    mode="primary"
                    active={true}
                    interactiveColor={theme.color.interactive.destructive}
                  />
                  <Button
                    expanded={true}
                    text="Disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    interactiveColor={theme.color.interactive.destructive}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__paragraph"
                >
                  Secondary - block
                </ThemeText>
                <View style={styles.buttonContainer}>
                  <Button
                    expanded={true}
                    text="Default"
                    onPress={presser}
                    mode="secondary"
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={true}
                    text="Active"
                    onPress={presser}
                    mode="secondary"
                    active={true}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={true}
                    text="Disabled"
                    onPress={presser}
                    mode="secondary"
                    disabled={true}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__paragraph"
                >
                  tertiary - block
                </ThemeText>
                <View style={styles.buttonContainer}>
                  <Button
                    expanded={true}
                    text="Default"
                    onPress={presser}
                    mode="tertiary"
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={true}
                    text="Active"
                    onPress={presser}
                    mode="tertiary"
                    active={true}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={true}
                    text="Disabled"
                    onPress={presser}
                    mode="tertiary"
                    disabled={true}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__paragraph"
                >
                  Medium button examples (interactive_0)
                </ThemeText>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Button
                    expanded={false}
                    text="Primary"
                    onPress={presser}
                    mode="primary"
                    interactiveColor={theme.color.interactive[0]}
                    style={{margin: 4}}
                  />
                  <Button
                    expanded={false}
                    text="Primary - active"
                    onPress={presser}
                    mode="primary"
                    active={true}
                    interactiveColor={theme.color.interactive[0]}
                    style={{margin: 4}}
                  />
                  <Button
                    expanded={false}
                    text="Primary - disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    interactiveColor={theme.color.interactive[0]}
                    style={{margin: 4}}
                  />
                  <Button
                    expanded={false}
                    text="Secondary"
                    onPress={presser}
                    mode="secondary"
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={false}
                    text="Secondary - active"
                    onPress={presser}
                    mode="secondary"
                    active={true}
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={false}
                    text="Tertiary"
                    onPress={presser}
                    mode="tertiary"
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={false}
                    text="Tertiary - disabled"
                    onPress={presser}
                    mode="tertiary"
                    disabled={true}
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__paragraph"
                >
                  Pill button examples (interactive_0)
                </ThemeText>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Button
                    expanded={false}
                    text="Primary"
                    onPress={presser}
                    mode="primary"
                    type="small"
                    interactiveColor={theme.color.interactive[0]}
                    style={{margin: 4}}
                  />
                  <Button
                    expanded={false}
                    text="Primary - active"
                    onPress={presser}
                    mode="primary"
                    type="small"
                    active={true}
                    interactiveColor={theme.color.interactive[0]}
                    style={{margin: 4}}
                  />
                  <Button
                    expanded={false}
                    text="Primary - disabled"
                    onPress={presser}
                    mode="primary"
                    type="small"
                    disabled={true}
                    interactiveColor={theme.color.interactive[0]}
                    style={{margin: 4}}
                  />
                  <Button
                    expanded={false}
                    text="Secondary"
                    onPress={presser}
                    mode="secondary"
                    type="small"
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={false}
                    text="Secondary - active"
                    onPress={presser}
                    mode="secondary"
                    type="small"
                    active={true}
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={false}
                    text="Tertiary"
                    onPress={presser}
                    mode="tertiary"
                    type="small"
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={false}
                    text="Tertiary - disabled"
                    onPress={presser}
                    mode="tertiary"
                    type="small"
                    disabled={true}
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  typography="heading__paragraph"
                >
                  With icons examples (interactive_0)
                </ThemeText>
                <Button
                  expanded={true}
                  text="Example"
                  onPress={presser}
                  mode="primary"
                  interactiveColor={theme.color.interactive[0]}
                  leftIcon={{svg: Add}}
                  style={{margin: 4}}
                />
                <Button
                  expanded={true}
                  text="Example"
                  onPress={presser}
                  mode="primary"
                  interactiveColor={theme.color.interactive[0]}
                  rightIcon={{
                    svg: Delete,
                    notificationColor: theme.color.interactive[0].default,
                  }}
                  style={{margin: 4}}
                />
                <Button
                  expanded={true}
                  text="Example"
                  onPress={presser}
                  mode="primary"
                  interactiveColor={theme.color.interactive[0]}
                  disabled={true}
                  leftIcon={{svg: Add}}
                  rightIcon={{svg: Delete}}
                  style={{margin: 4}}
                />
                <Button
                  expanded={true}
                  text="Loading button"
                  onPress={presser}
                  mode="primary"
                  interactiveColor={theme.color.interactive[0]}
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
                    expanded={false}
                    text="Example"
                    onPress={presser}
                    mode="primary"
                    interactiveColor={theme.color.interactive[0]}
                    leftIcon={{
                      svg: Add,
                      notificationColor: theme.color.status.valid.primary,
                    }}
                    style={{margin: 4}}
                  />
                  <Button
                    expanded={false}
                    text="Example"
                    onPress={presser}
                    mode="primary"
                    active={true}
                    interactiveColor={theme.color.interactive[0]}
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    expanded={false}
                    text="Example"
                    onPress={presser}
                    mode="secondary"
                    active={true}
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={false}
                    text="Example"
                    onPress={presser}
                    mode="tertiary"
                    active={true}
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={false}
                    text="Example"
                    onPress={presser}
                    mode="primary"
                    active={true}
                    interactiveColor={theme.color.interactive[0]}
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    expanded={false}
                    onPress={presser}
                    mode="primary"
                    interactiveColor={theme.color.interactive[0]}
                    leftIcon={{svg: Add}}
                    style={{margin: 4}}
                  />
                  <Button
                    expanded={false}
                    onPress={presser}
                    mode="secondary"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    expanded={false}
                    onPress={presser}
                    mode="tertiary"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    text="Example"
                    onPress={presser}
                    mode="primary"
                    type="small"
                    expanded={false}
                    interactiveColor={theme.color.interactive[0]}
                    leftIcon={{svg: Add}}
                    style={{margin: 4}}
                  />
                  <Button
                    text="Example"
                    onPress={presser}
                    mode="secondary"
                    type="small"
                    expanded={false}
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
                  />
                  <Button
                    text="Example"
                    onPress={presser}
                    mode="tertiary"
                    type="small"
                    expanded={false}
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                    backgroundColor={theme.color.background.neutral[0]}
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
          <GenericSectionItem interactiveColor={theme.color.interactive[0]}>
            <ThemeText color={theme.color.foreground.light.primary}>
              Generic section item with interactiveColor
            </ThemeText>
          </GenericSectionItem>
        </Section>

        <Section style={styles.section}>
          <ToggleSectionItem
            text="Some short text"
            leftImage={<ThemeIcon svg={Bus} />}
            onValueChange={() => {}}
          />
          <RadioSectionItem
            text="Some short text and interactive color"
            selected={selected}
            onPress={() => setSelected(!selected)}
          />
          <RadioSectionItem
            text="Some very long text over here which goes over multiple lines"
            subtext="With a subtext and icon, no interactive color"
            leftIcon={Bus}
            selected={selected}
            onPress={() => setSelected(!selected)}
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
            icon="arrow-left"
          />

          <LinkSectionItem
            text="Disabled link"
            onPress={() => {}}
            disabled
            icon={{svg: Edit}}
          />
          <LinkSectionItem
            text="Some longer text"
            onPress={() => {}}
            icon={{svg: Edit}}
          />
          <LinkSectionItem
            text="Dangerous Link Item"
            subtitle="Subtitle text"
            onPress={() => {}}
            icon={{svg: Delete, color: 'error'}}
          />
          <LinkSectionItem
            text="Disabled Dangerous Link Item text"
            subtitle="Disabled Subtitle text"
            disabled={true}
            onPress={() => {}}
            icon={{svg: Delete, color: 'error'}}
          />
          <LinkSectionItem
            text="Link with interactiveColor"
            interactiveColor={theme.color.interactive[0]}
          />
          <LinkSectionItem
            text="Active link with interactveColor"
            interactiveColor={theme.color.interactive[0]}
            active
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
        <View style={styles.swatchGroup}>{secondaryTransportSwatches}</View>
        <View style={styles.swatchGroup}>{statusSwatches}</View>
        <View style={styles.swatchGroup}>
          <ThemeText>Text colors:</ThemeText>
          {textSwatches}
        </View>

        <View style={{margin: theme.spacing.medium}}>
          <ThemeText>Segmented controls:</ThemeText>
          {radioSegments}
        </View>
      </ScrollView>
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
  transportationIcon: {
    marginRight: theme.spacing.xSmall,
  },
  icons: {
    flexDirection: 'row',
    marginBottom: theme.spacing.small,
    flexWrap: 'wrap',
  },
  section: {
    marginTop: theme.spacing.large,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  swatchGroup: {
    margin: theme.spacing.medium,
  },
}));
