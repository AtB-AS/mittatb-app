import React from 'react';
import {
  ActionSectionItem,
  ButtonSectionItem,
  CounterSectionItem,
  DateInputSectionItem,
  ExpandableSectionItem,
  FavoriteDepartureSectionItem,
  FavoriteSectionItem,
  GenericClickableSectionItem,
  GenericSectionItem,
  HeaderSectionItem,
  LinkSectionItem,
  LocationInputSectionItem,
  MessageSectionItem,
  PhoneInputSectionItem,
  Section,
  SectionProps,
  TextInputSectionItem,
  TimeInputSectionItem,
  ToggleSectionItem,
  InternalLabeledSectionItem,
  RadioGroupSection,
  ContainerSizingType,
} from '@atb/components/sections';
import {Meta} from '@storybook/react-native';
import {ScrollView, View} from 'react-native';
import {
  themedStoryControls,
  ThemedStoryDecorator,
  themedStoryDefaultArgs,
  ThemedStoryProps,
} from '@atb/storybook/ThemedStoryDecorator';
import {ThemeText} from '@atb/components/text';

type SectionMetaProps = SectionProps & ThemedStoryProps;
const containerSizingType: ContainerSizingType[] = ['block', 'spacious'];

const SectionMeta: Meta<SectionMetaProps> = {
  title: 'Section',
  component: Section,
  argTypes: {
    ...themedStoryControls,
    type: {
      control: 'select',
      options: containerSizingType,
    },
  },
  args: {
    ...themedStoryDefaultArgs,
    type: 'block',
  },
};
export default SectionMeta;

export const ListedSectionItems: Meta<SectionMetaProps> = {
  args: {style: {margin: 12}, backgroundColor: 'background_2'},
  decorators: [
    (Story, {args}) => (
      <ScrollView>
        <Story
          args={{
            ...args,
            children: (
              <Section>
                <HeaderSectionItem
                  text="HeaderSectionItem"
                  mode="heading"
                  transparent={false}
                />
                <ButtonSectionItem
                  label="ButtonSectionItem"
                  onPress={() => {}}
                />
                <ActionSectionItem
                  text="ActionSectionItem"
                  onPress={() => {}}
                />
                <CounterSectionItem
                  text="CounterSectionItem"
                  count={2}
                  addCount={() => {}}
                  removeCount={() => {}}
                />
                <ExpandableSectionItem
                  text="ExpandableSectionItem"
                  onPress={() => {}}
                  expandContent={<ThemeText>Content</ThemeText>}
                />
                <FavoriteDepartureSectionItem
                  favorite={{
                    id: '1',
                    stopId: '2',
                    lineId: '3',
                    quayId: '4',
                    quayName: 'FavoriteDepartureSectionItem',
                  }}
                />
                <FavoriteSectionItem
                  favorite={{
                    id: '1',
                    location: {
                      id: '2',
                      name: 'FavoriteSectionItem',
                      layer: 'address',
                      coordinates: {longitude: 3, latitude: 4},
                      locality: '',
                      category: [],
                      resultType: 'favorite',
                      favoriteId: '5',
                    },
                  }}
                />
                <GenericClickableSectionItem>
                  <ThemeText>GenericClickableSectionItem</ThemeText>
                </GenericClickableSectionItem>
                <GenericSectionItem>
                  <ThemeText>GenericSectionItem</ThemeText>
                </GenericSectionItem>
                <InternalLabeledSectionItem label="InternalLabeledSectionItem">
                  <ThemeText>Content</ThemeText>
                </InternalLabeledSectionItem>
                <LinkSectionItem text="LinkSectionItem" />
                <LocationInputSectionItem
                  label="LocationInputSectionItem"
                  onPress={() => {}}
                />
                <MessageSectionItem
                  messageType="valid"
                  message="MessageSectionItem"
                />
                <PhoneInputSectionItem
                  label="PhoneInputSectionItem"
                  prefix="47"
                  onChangePrefix={() => {}}
                />
                <TextInputSectionItem label="TextInputSectionItem" />
                <ToggleSectionItem
                  text="ToggleSectionItem"
                  onValueChange={() => {}}
                />
                <DateInputSectionItem
                  value={new Date().toISOString()}
                  onChange={() => {}}
                />
                <TimeInputSectionItem value="22:22" onChange={() => {}} />
              </Section>
            ),
          }}
        />
      </ScrollView>
    ),
    ThemedStoryDecorator,
  ],
};

export const OneSectionItem: Meta<SectionMetaProps> = {
  args: {style: {margin: 12}},
  decorators: [
    (Story, {args}) => (
      <View style={{backgroundColor: 'pink'}}>
        <Story
          args={{
            ...args,
            children: (
              <View>
                <Section>
                  <GenericClickableSectionItem>
                    <ThemeText>GenericClickableSectionItem</ThemeText>
                  </GenericClickableSectionItem>
                </Section>
              </View>
            ),
          }}
        />
      </View>
    ),
    ThemedStoryDecorator,
  ],
};

export const RadioSection: Meta<SectionMetaProps> = {
  args: {style: {margin: 12}, backgroundColor: 'background_1'},
  decorators: [
    (Story, {args}) => (
      <Story
        args={{
          ...args,
          children: (
            <RadioGroupSection
              items={['Radio group option 1', 'Radio group option 2']}
              keyExtractor={(s) => s}
              itemToText={(t) => t}
              selected="Radio group option 1"
            />
          ),
        }}
      />
    ),
    ThemedStoryDecorator,
  ],
};
