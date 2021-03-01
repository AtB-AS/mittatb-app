import {Delete} from '@atb/assets/svg/icons/actions';
import {Check} from '@atb/assets/svg/icons/status';
import {BlankTicket} from '@atb/assets/svg/icons/ticketing';
import Button, {ButtonGroup} from '@atb/components/button';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import MessageBox from '@atb/components/message-box';
import {StyleSheet, Theme} from '@atb/theme';
import {textNames, TextNames} from '@atb/theme/colors';
import React from 'react';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

export default function DesignSystem() {
  const style = useProfileHomeStyle();

  return (
    <View style={style.container}>
      <FullScreenHeader
        title="Design System"
        leftButton={{type: 'home'}}
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

              <ThemeIcon svg={BlankTicket} colorType="error" />
              <ThemeIcon svg={BlankTicket} colorType="disabled" size="small" />
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
              retryFunction={presser}
            />
          </Sections.GenericItem>
        </Sections.Section>

        <MessageBox
          message="This is a message with margin outside of generic component"
          withMargin
        />

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
        </ButtonGroup>

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
      </ScrollView>
    </View>
  );
}

function presser() {
  Alert.alert('Heyo');
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.level1,
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
  },
}));
