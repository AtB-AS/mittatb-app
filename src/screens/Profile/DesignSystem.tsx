import {ContrastColor} from '@atb-as/theme';
import {Delete, Edit} from '@atb/assets/svg/mono-icons/actions';
import {Check} from '@atb/assets/svg/mono-icons/status';
import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import Button, {ButtonGroup} from '@atb/components/button';
import MessageBox from '@atb/components/message-box';
import RadioSegments from '@atb/components/radio-segments';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import TransportationIcon from '@atb/components/transportation-icon';
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

export default function DesignSystem() {
  const style = useProfileHomeStyle();
  const {theme} = useTheme();

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
      {name}
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
          <Sections.HeaderItem text="Icons" />

          <Sections.GenericItem>
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
          </Sections.GenericItem>
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderItem text="Messages" />

          <Sections.GenericItem>
            <MessageBox message="This is a message" />
          </Sections.GenericItem>

          <Sections.GenericItem>
            <MessageBox message="This is a message with title" title="Title" />
          </Sections.GenericItem>

          <Sections.GenericItem>
            <MessageBox
              message="This is a warning"
              title="Title"
              type="warning"
            />
          </Sections.GenericItem>

          <Sections.GenericItem>
            <MessageBox
              message="This is a success message"
              title="Title"
              type="valid"
            />
          </Sections.GenericItem>

          <Sections.GenericItem>
            <MessageBox
              message="This is an error with retry link"
              title="Title"
              type="error"
              onPress={presser}
            />
          </Sections.GenericItem>

          <Sections.GenericItem>
            <MessageBox
              isMarkdown={true}
              title="Markdown"
              message={`This is a message with markdown,\nSupporting **bold** and *italics*\nand special characters like ', " + æøå`}
            />
          </Sections.GenericItem>
        </Sections.Section>

        <MessageBox
          message="This is a message with margin outside of generic component"
          withMargin
        />

        <View style={style.buttons}>
          <ButtonGroup>
            <Button text="primary" onPress={presser} mode="primary" />
            <Button text="secondary" onPress={presser} mode="secondary" />
            <Button text="tertiary" onPress={presser} mode="tertiary" />
            <Button
              text="Press me"
              onPress={presser}
              icon={Delete}
              iconPosition="right"
            />
            <Button text="Press me" onPress={presser} type="inline" />
            <Button text="Press me" onPress={presser} type="compact" />
            <Button
              text="Press me"
              onPress={presser}
              type="compact"
              icon={Delete}
              iconPosition="right"
            />
            <Button
              text="Press me"
              onPress={presser}
              type="inline"
              icon={Delete}
              iconPosition="left"
            />
          </ButtonGroup>
        </View>

        <Sections.Section withPadding withTopPadding>
          <Sections.ActionItem
            text="Some very long text over here which goes over multiple lines"
            mode="check"
            checked
          />
          <Sections.ActionItem text="Some short text" mode="toggle" />
          <Sections.ActionItem
            text="Some short text"
            mode="check"
            checked
            type="compact"
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.LocationInput
            label="Label"
            placeholder="My very long placeholder over here. Yes over multiple lines"
            onPress={() => {}}
          />
          <Sections.LocationInput
            label="Label"
            placeholder="Short"
            onPress={() => {}}
            type="compact"
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.ButtonInput
            label="Label"
            placeholder="My very long placeholder over here. Yes over multiple lines"
            onPress={() => {}}
            icon="arrow-left"
          />

          <Sections.LinkItem
            text="Some longer text"
            onPress={() => {}}
            disabled
            icon={<ThemeIcon svg={Edit} />}
          />
          <Sections.LinkItem
            text="Some longer text"
            onPress={() => {}}
            icon={<ThemeIcon svg={Edit} />}
          />
          <Sections.LinkItem
            text="Dangerous Link Item"
            subtitle="Subtitle text"
            onPress={() => {}}
            icon={<ThemeIcon svg={Delete} colorType="error" />}
          />
          <Sections.LinkItem
            text="Disabled Dangerous Link Item text"
            subtitle="Disabled Subtitle text"
            disabled={true}
            onPress={() => {}}
            icon={<ThemeIcon svg={Delete} colorType="error" />}
          />
        </Sections.Section>

        <Sections.Section withPadding withTopPadding>
          <Sections.TextInput
            label="Input"
            placeholder="My very long placeholder over here. Yes over multiple lines"
            onChangeText={() => {}}
            keyboardType="phone-pad"
            textContentType="oneTimeCode"
            showClear={true}
            inlineLabel={false}
          />

          <Sections.TextInput
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
          <Sections.HeaderItem text="Texts" />

          <Sections.GenericItem>
            {textNames.map(function (t: TextNames) {
              return (
                <ThemeText type={t} key={t}>
                  {t}
                </ThemeText>
              );
            })}
          </Sections.GenericItem>
        </Sections.Section>

        <View style={style.buttons}>
          <ButtonGroup>{buttons}</ButtonGroup>
        </View>

        <View style={style.swatchGroup}>{backgroundSwatches}</View>
        <View style={style.swatchGroup}>{transportSwatches}</View>
        <View style={style.swatchGroup}>{statusSwatches}</View>

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
