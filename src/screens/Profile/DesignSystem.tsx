import {ContrastColor} from '@atb-as/theme';
import {Delete, Edit} from '@atb/assets/svg/mono-icons/actions';
import {Check} from '@atb/assets/svg/mono-icons/status';
import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import {Button, ButtonGroup} from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import {RadioSegments} from '@atb/components/radio';
import {FullScreenHeader} from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TransportationIcon} from '@atb/components/transportation-icon';
import {LegMode, TransportSubmode} from '@atb/sdk';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {
  InteractiveColor,
  StaticColorByType,
  textNames,
  TextNames,
} from '@atb/theme/colors';
import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Info} from '@atb/assets/svg/color/icons/status';
import {dictionary, useTranslation} from '@atb/translations';
import {Bus} from '@atb/assets/svg/mono-icons/transportation';

export default function DesignSystem() {
  const style = useProfileHomeStyle();
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

  const transportSwatches = Object.keys(theme.static.transport).map((color) => {
    const staticColor =
      theme.static.transport[color as StaticColorByType<'transport'>];
    return <Swatch color={staticColor} name={color} key={color} />;
  });

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
        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderSectionItem text="Icons" />

          <Sections.GenericSectionItem>
            <View style={style.icons}>
              <ThemeIcon svg={Check} />
              <ThemeIcon svg={Check} colorType="info" />
              <ThemeIcon svg={Check} colorType="warning" />

              <ThemeIcon svg={Ticket} colorType="error" />
              <ThemeIcon svg={Ticket} colorType="disabled" size="small" />
            </View>
            <View style={style.icons}>
              <TransportationIcon
                mode={LegMode.BUS}
                subMode={TransportSubmode.LOCAL_BUS}
              />
              {Object.values(LegMode).map((mode) => (
                <TransportationIcon mode={mode} />
              ))}
            </View>
          </Sections.GenericSectionItem>
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderSectionItem text="Messages" />

          <Sections.GenericSectionItem>
            <MessageBox type="info" message="This is a message" />
          </Sections.GenericSectionItem>

          <Sections.GenericSectionItem>
            <MessageBox
              type="info"
              message="This is a message with title"
              title="Title"
            />
          </Sections.GenericSectionItem>

          <Sections.GenericSectionItem>
            <MessageBox
              message="This is a warning"
              title="Title"
              type="warning"
            />
          </Sections.GenericSectionItem>

          <Sections.GenericSectionItem>
            <MessageBox
              message="This is a success message"
              title="Title"
              type="valid"
            />
          </Sections.GenericSectionItem>

          <Sections.GenericSectionItem>
            <MessageBox
              message="This is an error with retry link"
              title="Title"
              type="error"
              onPressConfig={{
                action: presser,
                text: t(dictionary.retry),
              }}
            />
          </Sections.GenericSectionItem>

          <Sections.GenericSectionItem>
            <MessageBox
              type="info"
              isMarkdown={true}
              title="Markdown"
              message={`This is a message with markdown,\nSupporting **bold** and *italics*\nand special characters like ', " + æøå`}
            />
          </Sections.GenericSectionItem>

          <Sections.GenericSectionItem>
            <MessageBox
              type="info"
              title="With dismiss"
              onDismiss={() => Alert.alert('Closed')}
              message={`This is a message with dismiss button`}
            />
          </Sections.GenericSectionItem>

          <Sections.GenericSectionItem>
            <MessageBox
              type="warning"
              title="With dismiss and action"
              onDismiss={() => Alert.alert('Closed')}
              onPressConfig={{
                action: presser,
                text: 'Do action',
              }}
              message={`This is a message with dismiss and action`}
            />
          </Sections.GenericSectionItem>

          <Sections.GenericSectionItem>
            <MessageBox
              type="error"
              title="With dismiss and link"
              onDismiss={() => Alert.alert('Closed')}
              onPressConfig={{
                url: 'https://atb.no',
                text: 'Go to atb.no',
              }}
              message={`This is a message with dismiss and link`}
            />
          </Sections.GenericSectionItem>

          <Sections.GenericSectionItem>
            <MessageBox
              type="valid"
              isMarkdown={true}
              title="Without icon"
              noStatusIcon={true}
              message={`This is a message without status icon`}
            />
          </Sections.GenericSectionItem>
        </Sections.Section>

        <View style={style.buttons}>
          <ButtonGroup>
            <Button text="primary" onPress={presser} mode="primary" />
            <Button text="secondary" onPress={presser} mode="secondary" />
            <Button text="tertiary" onPress={presser} mode="tertiary" />
            <Button
              text="Press me"
              onPress={presser}
              rightIcon={{svg: Delete}}
            />
            <Button text="Press me" onPress={presser} type="inline" />
            <Button
              text="Press me"
              onPress={presser}
              type="inline"
              compact={true}
            />
            <Button
              text="Press me"
              onPress={presser}
              type="inline"
              compact={true}
              rightIcon={{svg: Delete}}
            />
            <Button
              text="Press me"
              onPress={presser}
              type="inline"
              leftIcon={{svg: Delete}}
            />
            <Button
              text="Press me"
              onPress={presser}
              type="inline"
              leftIcon={{svg: Delete}}
              rightIcon={{svg: Delete}}
            />
            <Button
              text="Press me"
              onPress={presser}
              leftIcon={{svg: Delete}}
              rightIcon={{svg: Info}}
            />
          </ButtonGroup>
        </View>

        <Sections.Section withPadding withTopPadding>
          <Sections.ActionSectionItem
            text="Some very long text over here which goes over multiple lines"
            subtext="With a subtext"
            mode="check"
            onPress={() => {}}
            leftIcon={Bus}
            checked
          />
          <Sections.ToggleSectionItem
            text="Some short text"
            leftIcon={Bus}
            onValueChange={() => {}}
          />
          <Sections.ActionSectionItem
            text="Some short text"
            mode="check"
            checked
            type="compact"
            leftIcon={Bus}
            onPress={() => {}}
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.LocationInputSectionItem
            label="Label"
            placeholder="My very long placeholder over here. Yes over multiple lines"
            onPress={() => {}}
          />
          <Sections.LocationInputSectionItem
            label="Label"
            placeholder="Short"
            onPress={() => {}}
            type="compact"
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.ButtonSectionItem
            label="Label"
            placeholder="My very long placeholder over here. Yes over multiple lines"
            onPress={() => {}}
            icon="arrow-left"
          />

          <Sections.LinkSectionItem
            text="Some longer text"
            onPress={() => {}}
            disabled
            icon={<ThemeIcon svg={Edit} />}
          />
          <Sections.LinkSectionItem
            text="Some longer text"
            onPress={() => {}}
            icon={<ThemeIcon svg={Edit} />}
          />
          <Sections.LinkSectionItem
            text="Dangerous Link Item"
            subtitle="Subtitle text"
            onPress={() => {}}
            icon={<ThemeIcon svg={Delete} colorType="error" />}
          />
          <Sections.LinkSectionItem
            text="Disabled Dangerous Link Item text"
            subtitle="Disabled Subtitle text"
            disabled={true}
            onPress={() => {}}
            icon={<ThemeIcon svg={Delete} colorType="error" />}
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.TextInputSectionItem
            label="Input"
            placeholder="My very long placeholder over here. Yes over multiple lines"
            onChangeText={() => {}}
            keyboardType="phone-pad"
            textContentType="oneTimeCode"
            showClear={true}
            inlineLabel={false}
          />

          <Sections.TextInputSectionItem
            label="Input"
            placeholder="Short placeholder"
            onChangeText={() => {}}
            keyboardType="phone-pad"
            textContentType="oneTimeCode"
            showClear={true}
            inlineLabel={false}
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderSectionItem text="Texts" />

          <Sections.GenericSectionItem>
            {textNames.map(function (t: TextNames) {
              return (
                <ThemeText type={t} key={t}>
                  {t}
                </ThemeText>
              );
            })}
          </Sections.GenericSectionItem>
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderSectionItem text="Message section items" />

          <Sections.MessageSectionItem
            messageType="info"
            title="Information message!"
            message="An information message with title"
          />

          <Sections.MessageSectionItem
            messageType="valid"
            message="A success message without title"
          />

          <Sections.MessageSectionItem
            messageType="warning"
            title="Warning message!"
            message="A warning message with title link"
            onPressConfig={{
              url: 'https://atb.no',
              text: 'Go to atb.no',
            }}
          />

          <Sections.MessageSectionItem
            messageType="error"
            message="An error message without title and with action"
            onPressConfig={{
              action: presser,
              text: t(dictionary.retry),
            }}
          />
        </Sections.Section>

        <View style={style.buttons}>
          <ButtonGroup>{buttons}</ButtonGroup>
        </View>

        <View style={style.swatchGroup}>{backgroundSwatches}</View>
        <View style={style.swatchGroup}>{transportSwatches}</View>
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
}

function presser() {
  Alert.alert('Heyo');
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
  },
  buttons: {
    marginHorizontal: theme.spacings.medium,
  },
  swatchGroup: {
    margin: theme.spacings.medium,
  },
}));
