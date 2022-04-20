import {Delete, Edit} from '@atb/assets/svg/mono-icons/actions';
import {Check} from '@atb/assets/svg/mono-icons/status';
import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import Button, {ButtonGroup} from '@atb/components/button';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import MessageBox from '@atb/components/message-box';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {textNames, TextNames, ThemeColor} from '@atb/theme/colors';
import React from 'react';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {LegMode, TransportSubmode} from '@atb/sdk';
import TransportationIcon from '@atb/components/transportation-icon';

export default function DesignSystem() {
  const style = useProfileHomeStyle();
  const {theme} = useTheme();

  const buttons = Object.keys(theme.colors).map((themeName) => (
    <Button
      key={themeName}
      text={themeName}
      onPress={() =>
        Alert.alert(theme.colors[themeName as ThemeColor].backgroundColor)
      }
      color={themeName as ThemeColor}
    />
  ));

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
            <Button text="Press me" onPress={presser} mode="primary" />
            <Button
              text="Press me"
              onPress={presser}
              mode="primary"
              color="secondary_1"
            />
            <Button text="Press me" onPress={presser} mode="secondary" />
            <Button text="Press me" onPress={presser} mode="destructive" />
            <Button
              text="Press me"
              onPress={presser}
              mode="destructive"
              icon={Delete}
            />
            <Button
              text="Press me"
              onPress={presser}
              mode="destructive"
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
      </ScrollView>
    </View>
  );
}

function presser() {
  Alert.alert('Heyo');
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
  },
  buttons: {
    marginHorizontal: theme.spacings.medium,
  },
}));
