import React from 'react';
import {
  ButtonSectionItem,
  HeaderSectionItem,
  Section,
  SectionProps,
} from '@atb/components/sections';
import {Meta} from '@storybook/react-native';
import {View} from 'react-native';
import {
  themedStoryControls,
  ThemedStoryDecorator,
  ThemedStoryProps,
} from '@atb/storybook/ThemedStoryDecorator';

type SectionMetaProps = SectionProps & ThemedStoryProps;

const SectionMeta: Meta<SectionMetaProps> = {
  title: 'Section',
  component: Section,
  argTypes: {
    ...themedStoryControls,
    withPadding: {control: 'boolean'},
    withFullPadding: {control: 'boolean'},
    withTopPadding: {control: 'boolean'},
    withBottomPadding: {control: 'boolean'},
    type: {
      control: 'select',
      options: ['inline', 'compact', 'block', 'spacious'], // ContainerSizingType
    },
  },
  args: {
    theme: 'light',
    backgroundColor: 'background_1',
    type: 'block',
  },
  decorators: [
    (Story, {args}) => (
      <View style={{backgroundColor: 'pink'}}>
        <Story
          args={{
            ...args,
            children: (
              <Section>
                <HeaderSectionItem
                  text="This is a heading"
                  mode="heading"
                  transparent={false}
                />
                <ButtonSectionItem label="Button label" onPress={() => {}} />
              </Section>
            ),
          }}
        />
      </View>
    ),
    ThemedStoryDecorator,
  ],
};
export default SectionMeta;

export const Block = {
  args: {children: ButtonSectionItem, withPadding: true},
};
