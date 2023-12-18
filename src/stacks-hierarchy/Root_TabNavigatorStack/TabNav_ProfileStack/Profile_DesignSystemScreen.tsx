import {ContrastColor} from '@atb-as/theme';
import {Add, Delete, Edit, Feedback} from '@atb/assets/svg/mono-icons/actions';
import {Check} from '@atb/assets/svg/mono-icons/status';
import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import {Button, ButtonGroup} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {RadioSegments} from '@atb/components/radio';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TransportationIconBox} from '@atb/components/icon-box';
import {LegMode, TransportSubmode} from '@atb/sdk';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {
  InteractiveColor,
  StaticColorByType,
  textNames,
  TextNames,
  TransportColor,
} from '@atb/theme/colors';
import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {dictionary, useTranslation} from '@atb/translations';
import {Bus} from '@atb/assets/svg/mono-icons/transportation';
import {useFontScale} from '@atb/utils/use-font-scale';
import {InfoChip} from '@atb/components/info-chip';
import {
  ActionSectionItem,
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
} from '@atb/components/sections';
import {ProfileScreenProps} from './navigation-types';
import {MessageInfoText} from '@atb/components/message-info-text';

type DesignSystemScreenProps = ProfileScreenProps<'Profile_DesignSystemScreen'>;

export const Profile_DesignSystemScreen = ({
  navigation,
}: DesignSystemScreenProps) => {
  const style = useProfileHomeStyle();
  const fontScale = useFontScale();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const [segmentedSelection, setSegmentedSelection] = useState(0);

  const buttons = Object.keys(theme.interactive).map((color) => (
    <Button
      key={color}
      text={color}
      onPress={() =>
        Alert.alert(
          theme.interactive[color as InteractiveColor].default.background,
        )
      }
      interactiveColor={color as InteractiveColor}
    />
  ));

  const Swatch: React.FC<{color: ContrastColor; name: string}> = ({
    color,
    name,
  }) => (
    <ThemeText
      style={{
        backgroundColor: color.background,
        color: color.text,
        padding: theme.spacings.medium,
      }}
    >
      {name} {color.text} / {color.background}
    </ThemeText>
  );

  const backgroundSwatches = Object.keys(theme.static.background).map(
    (color) => {
      const staticColor =
        theme.static.background[color as StaticColorByType<'background'>];
      return <Swatch color={staticColor} name={color} key={color} />;
    },
  );

  const transportSwatches = Object.keys(theme.transport).map((color) => {
    const staticColor = theme.transport[color as TransportColor];
    return <Swatch color={staticColor.primary} name={color} key={color} />;
  });
  const secondaryTransportSwatches = Object.keys(theme.transport).map(
    (color) => {
      const staticColor = theme.transport[color as TransportColor];
      return <Swatch color={staticColor.secondary} name={color} key={color} />;
    },
  );

  const statusSwatches = Object.keys(theme.static.status).map((color) => {
    const staticColor =
      theme.static.status[color as StaticColorByType<'status'>];
    return <Swatch color={staticColor} name={color} key={color} />;
  });

  const textSwatches = Object.keys(theme.text.colors).map((color) => {
    const textColors = theme.text.colors;
    return (
      <Swatch
        color={{
          text: theme.static.background.background_0.background,
          background: textColors[color as keyof typeof textColors],
        }}
        name={color}
        key={color}
      />
    );
  });

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

  const radioSegments = Object.keys(theme.interactive).map((color) => (
    <RadioSegments
      key={color}
      activeIndex={segmentedSelection}
      style={{
        marginTop: theme.spacings.small,
      }}
      color={color as InteractiveColor}
      options={radioSegmentsOptions}
    />
  ));

  // @TODO: add display of static colors

  return (
    <View style={style.container}>
      <FullScreenHeader
        title="Design System"
        leftButton={{type: 'back'}}
        rightButton={{type: 'chat'}}
      />

      <ScrollView>
        <Section withPadding withTopPadding>
          <HeaderSectionItem
            text={'Current font scale: ' + fontScale.toFixed(3)}
          />
          <LinkSectionItem
            text="Fare contracts"
            onPress={() => navigation.navigate('Profile_FareContractsScreen')}
          />
        </Section>
        <Section withPadding withTopPadding>
          <HeaderSectionItem text="Icons" />

          <GenericSectionItem>
            <View style={style.icons}>
              <ThemeIcon svg={Check} />
              <ThemeIcon svg={Check} colorType="info" />
              <ThemeIcon svg={Check} colorType="warning" />

              <ThemeIcon svg={Ticket} colorType="disabled" size="small" />
              <ThemeIcon svg={Ticket} colorType="error" />
              <ThemeIcon svg={Ticket} size="large" />
            </View>
            <View style={style.icons}>
              <ThemeText style={{marginRight: 12}}>
                With notification indicators:
              </ThemeText>

              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                size="small"
                notification={{color: 'valid'}}
              />
              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                colorType="error"
                notification={{color: 'info'}}
              />
              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                colorType="disabled"
                size="large"
                notification={{color: 'error'}}
              />
            </View>
            <View style={style.icons}>
              <ThemeText style={{marginRight: 12}}>
                And notification spacing:
              </ThemeText>

              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                size="small"
                notification={{color: 'valid', backgroundColor: 'background_0'}}
              />
              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                colorType="error"
                notification={{color: 'info', backgroundColor: 'background_0'}}
              />
              <ThemeIcon
                style={{marginRight: 12}}
                svg={Feedback}
                colorType="disabled"
                size="large"
                notification={{color: 'error', backgroundColor: 'background_0'}}
              />
            </View>
            <View style={style.icons}>
              <TransportationIconBox
                style={style.transportationIcon}
                mode={LegMode.BUS}
                subMode={TransportSubmode.LOCAL_BUS}
              />
              {Object.values(LegMode).map((mode) => (
                <TransportationIconBox
                  key={mode}
                  style={style.transportationIcon}
                  mode={mode}
                />
              ))}
            </View>
          </GenericSectionItem>
        </Section>

        <Section withPadding withTopPadding>
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
        <Section withPadding withTopPadding>
          <HeaderSectionItem text="Message Info Text" />

          <GenericSectionItem>
            <MessageInfoText
              type="info"
              isMarkdown={true}
              message="This is a message text"
              textColor="background_0"
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <MessageInfoText
              type="warning"
              isMarkdown={true}
              message="This is a warning text"
              textColor="background_0"
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <MessageInfoText
              type="error"
              isMarkdown={true}
              message="This is a error text"
              textColor="background_0"
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <MessageInfoText
              type="valid"
              isMarkdown={true}
              message="This is a valid text"
              textColor="background_0"
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <MessageInfoText
              type="valid"
              isMarkdown={true}
              iconSide="right"
              message="This is a text with right sided icon"
              textColor="background_0"
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <MessageInfoText
              type="valid"
              isMarkdown={true}
              message="This is a valid **markdown** message"
              textColor="background_0"
            />
          </GenericSectionItem>
        </Section>

        <Section style={style.section}>
          <ExpandableSectionItem
            text="InfoChip"
            showIconText={false}
            textType="heading__title"
            expandContent={
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: -theme.spacings.small,
                }}
              >
                <InfoChip
                  text="Interactive/0"
                  interactiveColor="interactive_0"
                  style={{
                    marginRight: theme.spacings.small,
                    marginTop: theme.spacings.small,
                  }}
                />
                <InfoChip
                  text="Interactive/1"
                  interactiveColor="interactive_1"
                  style={{
                    marginRight: theme.spacings.small,
                    marginTop: theme.spacings.small,
                  }}
                />
                <InfoChip
                  text="Interactive/2"
                  interactiveColor="interactive_2"
                  style={{
                    marginRight: theme.spacings.small,
                    marginTop: theme.spacings.small,
                  }}
                />
                <InfoChip
                  text="Interactive/destructive"
                  interactiveColor="interactive_destructive"
                  style={{
                    marginRight: theme.spacings.small,
                    marginTop: theme.spacings.small,
                  }}
                />
              </View>
            }
          />
        </Section>

        <Section style={style.section}>
          <ExpandableSectionItem
            text="Buttons"
            showIconText={false}
            textType="heading__title"
            expandContent={
              <View>
                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  Primary - block - interactive/0
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default"
                    onPress={presser}
                    mode="primary"
                    interactiveColor="interactive_0"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="primary"
                    active={true}
                    interactiveColor="interactive_0"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    interactiveColor="interactive_0"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="primary"
                    compact={true}
                    interactiveColor="interactive_0"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  Primary - block - interactive/1
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default - block"
                    onPress={presser}
                    mode="primary"
                    interactiveColor="interactive_1"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="primary"
                    active={true}
                    interactiveColor="interactive_1"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    interactiveColor="interactive_1"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="primary"
                    compact={true}
                    interactiveColor="interactive_1"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  Primary - block - interactive/2
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default"
                    onPress={presser}
                    mode="primary"
                    interactiveColor="interactive_2"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="primary"
                    active={true}
                    interactiveColor="interactive_2"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    interactiveColor="interactive_2"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="primary"
                    compact={true}
                    interactiveColor="interactive_2"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  Primary - block - interactive/destructive
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default"
                    onPress={presser}
                    mode="primary"
                    interactiveColor="interactive_destructive"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="primary"
                    active={true}
                    interactiveColor="interactive_destructive"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="primary"
                    disabled={true}
                    interactiveColor="interactive_destructive"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="primary"
                    compact={true}
                    interactiveColor="interactive_destructive"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  Secondary - block - interactive/0
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default"
                    onPress={presser}
                    mode="secondary"
                    interactiveColor="interactive_0"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="secondary"
                    active={true}
                    interactiveColor="interactive_0"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="secondary"
                    disabled={true}
                    interactiveColor="interactive_0"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="secondary"
                    compact={true}
                    interactiveColor="interactive_0"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  Secondary - block - interactive/1
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default"
                    onPress={presser}
                    mode="secondary"
                    interactiveColor="interactive_1"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="secondary"
                    active={true}
                    interactiveColor="interactive_1"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="secondary"
                    disabled={true}
                    interactiveColor="interactive_1"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="secondary"
                    compact={true}
                    interactiveColor="interactive_1"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  Secondary - block - interactive/2
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default"
                    onPress={presser}
                    mode="secondary"
                    interactiveColor="interactive_2"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="secondary"
                    active={true}
                    interactiveColor="interactive_2"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="secondary"
                    disabled={true}
                    interactiveColor="interactive_2"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="secondary"
                    compact={true}
                    interactiveColor="interactive_2"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  Secondary - block - interactive/destructive
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default"
                    onPress={presser}
                    mode="secondary"
                    interactiveColor="interactive_destructive"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="secondary"
                    active={true}
                    interactiveColor="interactive_destructive"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="secondary"
                    disabled={true}
                    interactiveColor="interactive_destructive"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="secondary"
                    compact={true}
                    interactiveColor="interactive_destructive"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  tertiary - block - interactive/0
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default"
                    onPress={presser}
                    mode="tertiary"
                    interactiveColor="interactive_0"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="tertiary"
                    active={true}
                    interactiveColor="interactive_0"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="tertiary"
                    disabled={true}
                    interactiveColor="interactive_0"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="tertiary"
                    compact={true}
                    interactiveColor="interactive_0"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  tertiary - block - interactive/1
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default"
                    onPress={presser}
                    mode="tertiary"
                    interactiveColor="interactive_1"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="tertiary"
                    active={true}
                    interactiveColor="interactive_1"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="tertiary"
                    disabled={true}
                    interactiveColor="interactive_1"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="tertiary"
                    compact={true}
                    interactiveColor="interactive_1"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  tertiary - block - interactive/2
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default"
                    onPress={presser}
                    mode="tertiary"
                    interactiveColor="interactive_2"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="tertiary"
                    active={true}
                    interactiveColor="interactive_2"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="tertiary"
                    disabled={true}
                    interactiveColor="interactive_2"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="tertiary"
                    compact={true}
                    interactiveColor="interactive_2"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  tertiary - block - interactive/destructive
                </ThemeText>
                <ButtonGroup>
                  <Button
                    text="Default"
                    onPress={presser}
                    mode="tertiary"
                    interactiveColor="interactive_destructive"
                  />
                  <Button
                    text="Active"
                    onPress={presser}
                    mode="tertiary"
                    active={true}
                    interactiveColor="interactive_destructive"
                  />
                  <Button
                    text="Disabled"
                    onPress={presser}
                    mode="tertiary"
                    disabled={true}
                    interactiveColor="interactive_destructive"
                  />
                  <Button
                    text="Compact"
                    onPress={presser}
                    mode="tertiary"
                    compact={true}
                    interactiveColor="interactive_destructive"
                  />
                </ButtonGroup>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  Inline button examples (interactive_0)
                </ThemeText>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Button
                    text="Primary"
                    onPress={presser}
                    mode="primary"
                    type="inline"
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Primary - active"
                    onPress={presser}
                    mode="primary"
                    type="inline"
                    active={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Primary - disabled"
                    onPress={presser}
                    mode="primary"
                    type="inline"
                    disabled={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Primary - compact"
                    onPress={presser}
                    mode="primary"
                    type="inline"
                    compact={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Secondary"
                    onPress={presser}
                    mode="secondary"
                    type="inline"
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Secondary - active"
                    onPress={presser}
                    mode="secondary"
                    type="inline"
                    active={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Secondary - compact"
                    onPress={presser}
                    mode="secondary"
                    type="inline"
                    compact={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Tertiary"
                    onPress={presser}
                    mode="tertiary"
                    type="inline"
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Tertiary - disabled"
                    onPress={presser}
                    mode="tertiary"
                    type="inline"
                    disabled={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  Pill button examples (interactive_0)
                </ThemeText>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Button
                    text="Primary"
                    onPress={presser}
                    mode="primary"
                    type="pill"
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Primary - active"
                    onPress={presser}
                    mode="primary"
                    type="pill"
                    active={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Primary - disabled"
                    onPress={presser}
                    mode="primary"
                    type="pill"
                    disabled={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Primary - compact"
                    onPress={presser}
                    mode="primary"
                    type="pill"
                    compact={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Secondary"
                    onPress={presser}
                    mode="secondary"
                    type="pill"
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Secondary - active"
                    onPress={presser}
                    mode="secondary"
                    type="pill"
                    active={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Secondary - compact"
                    onPress={presser}
                    mode="secondary"
                    type="pill"
                    compact={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Tertiary"
                    onPress={presser}
                    mode="tertiary"
                    type="pill"
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                  <Button
                    text="Tertiary - disabled"
                    onPress={presser}
                    mode="tertiary"
                    type="pill"
                    disabled={true}
                    interactiveColor="interactive_0"
                    style={{margin: 4}}
                  />
                </View>

                <ThemeText
                  style={{marginTop: 24, marginBottom: 12}}
                  type="heading__paragraph"
                >
                  With icons examples (interactive_0)
                </ThemeText>
                <Button
                  text="Example"
                  onPress={presser}
                  mode="primary"
                  interactiveColor="interactive_0"
                  leftIcon={{svg: Add}}
                  style={{margin: 4}}
                />
                <Button
                  text="Example"
                  onPress={presser}
                  mode="primary"
                  interactiveColor="interactive_0"
                  rightIcon={{
                    svg: Delete,
                    notification: {color: 'interactive_0'},
                  }}
                  style={{margin: 4}}
                />
                <Button
                  text="Example"
                  onPress={presser}
                  mode="primary"
                  interactiveColor="interactive_0"
                  disabled={true}
                  leftIcon={{svg: Add}}
                  rightIcon={{svg: Delete}}
                  style={{margin: 4}}
                />
                <Button
                  text="Loading button"
                  onPress={presser}
                  mode="primary"
                  interactiveColor="interactive_0"
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
                    text="Example"
                    onPress={presser}
                    mode="primary"
                    type="inline"
                    interactiveColor="interactive_0"
                    leftIcon={{svg: Add, notification: {color: 'valid'}}}
                    style={{margin: 4}}
                  />
                  <Button
                    text="Example"
                    onPress={presser}
                    mode="primary"
                    type="inline"
                    active={true}
                    interactiveColor="interactive_0"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    text="Example"
                    onPress={presser}
                    mode="secondary"
                    type="inline"
                    active={true}
                    interactiveColor="interactive_0"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    text="Example"
                    onPress={presser}
                    mode="tertiary"
                    type="inline"
                    active={true}
                    interactiveColor="interactive_0"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    text="Example"
                    onPress={presser}
                    mode="primary"
                    type="inline"
                    active={true}
                    interactiveColor="interactive_0"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    onPress={presser}
                    mode="primary"
                    type="inline"
                    interactiveColor="interactive_0"
                    leftIcon={{svg: Add}}
                    style={{margin: 4}}
                  />
                  <Button
                    onPress={presser}
                    mode="primary"
                    type="inline"
                    compact={true}
                    interactiveColor="interactive_0"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    onPress={presser}
                    mode="secondary"
                    type="inline"
                    interactiveColor="interactive_0"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    onPress={presser}
                    mode="tertiary"
                    type="inline"
                    interactiveColor="interactive_0"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    text="Example"
                    onPress={presser}
                    mode="primary"
                    type="pill"
                    interactiveColor="interactive_0"
                    leftIcon={{svg: Add}}
                    style={{margin: 4}}
                  />
                  <Button
                    text="Example"
                    onPress={presser}
                    mode="secondary"
                    type="pill"
                    compact={true}
                    interactiveColor="interactive_0"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                  <Button
                    text="Example"
                    onPress={presser}
                    mode="tertiary"
                    type="pill"
                    interactiveColor="interactive_0"
                    rightIcon={{svg: Delete}}
                    style={{margin: 4}}
                  />
                </View>
              </View>
            }
          />
        </Section>

        <Section withPadding withTopPadding>
          <ActionSectionItem
            text="Some very long text over here which goes over multiple lines"
            subtext="With a subtext"
            mode="check"
            onPress={() => {}}
            leftIcon={Bus}
            checked
          />
          <ToggleSectionItem
            text="Some short text"
            leftImage={Bus}
            onValueChange={() => {}}
          />
          <ActionSectionItem
            text="Some short text"
            mode="check"
            checked
            type="compact"
            leftIcon={Bus}
            onPress={() => {}}
          />
        </Section>

        <Section withPadding withTopPadding>
          <LocationInputSectionItem
            label="Label"
            placeholder="My very long placeholder over here. Yes over multiple lines"
            onPress={() => {}}
          />
          <LocationInputSectionItem
            label="Label"
            placeholder="Short"
            onPress={() => {}}
            type="compact"
          />
        </Section>

        <Section withPadding withTopPadding>
          <ButtonSectionItem
            label="Label"
            placeholder="My very long placeholder over here. Yes over multiple lines"
            onPress={() => {}}
            icon="arrow-left"
          />

          <LinkSectionItem
            text="Some longer text"
            onPress={() => {}}
            disabled
            icon={<ThemeIcon svg={Edit} />}
          />
          <LinkSectionItem
            text="Some longer text"
            onPress={() => {}}
            icon={<ThemeIcon svg={Edit} />}
          />
          <LinkSectionItem
            text="Dangerous Link Item"
            subtitle="Subtitle text"
            onPress={() => {}}
            icon={<ThemeIcon svg={Delete} colorType="error" />}
          />
          <LinkSectionItem
            text="Disabled Dangerous Link Item text"
            subtitle="Disabled Subtitle text"
            disabled={true}
            onPress={() => {}}
            icon={<ThemeIcon svg={Delete} colorType="error" />}
          />
          <LinkSectionItem text="Link with label" label="new" />
        </Section>

        <Section withPadding withTopPadding>
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

        <Section withPadding withTopPadding>
          <HeaderSectionItem text="Texts" />

          <GenericSectionItem>
            {textNames.map(function (t: TextNames) {
              return (
                <ThemeText type={t} key={t}>
                  {t}
                </ThemeText>
              );
            })}
          </GenericSectionItem>
        </Section>

        <Section withPadding withTopPadding>
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

        <View style={style.section}>
          <ButtonGroup>{buttons}</ButtonGroup>
        </View>

        <View style={style.swatchGroup}>{backgroundSwatches}</View>
        <View style={style.swatchGroup}>{transportSwatches}</View>
        <View style={style.swatchGroup}>{secondaryTransportSwatches}</View>
        <View style={style.swatchGroup}>{statusSwatches}</View>
        <View style={style.swatchGroup}>
          <ThemeText>Text colors:</ThemeText>
          {textSwatches}
        </View>

        <View style={{margin: theme.spacings.medium}}>
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

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  transportationIcon: {
    marginRight: theme.spacings.xSmall,
  },
  icons: {
    flexDirection: 'row',
    marginBottom: theme.spacings.small,
    flexWrap: 'wrap',
  },
  section: {
    margin: theme.spacings.medium,
  },
  swatchGroup: {
    margin: theme.spacings.medium,
  },
}));
