import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import colors from '../theme/colors';

const FavoriteChips: React.FC = () => {
  return (
    <View
      style={{
        marginBottom: 24,
        height: 44,
      }}
    >
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <FavoriteChip text="Min posisjon" icon={<Text>🚀</Text>} />
        <FavoriteChip text="Hjem" icon={<Text>🏠</Text>} />
        <FavoriteChip text="Jobb" icon={<Text>👩🏻‍💻</Text>} />
      </ScrollView>
    </View>
  );
};

export default FavoriteChips;

type ChipProps = {
  text: string;
  icon: JSX.Element;
};

const FavoriteChip: React.FC<ChipProps> = ({text, icon}) => {
  return (
    <View style={chipStyles.container}>
      {icon}
      <Text style={chipStyles.text}>{text}</Text>
    </View>
  );
};

const chipStyles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 4,
    borderTopLeftRadius: 16,
    backgroundColor: colors.secondary.cyan,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 12,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});
