import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import tw from '../../../lib/tailwind';
import Images from '../../../constant/Images';

interface DecisionMethodCardProps {
  id: number;
  title: string;
  image: any;
  disabled: boolean;
  selected?: number;
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_SIZE = width / 2 - CARD_MARGIN * 2;

const DecisionMethodCard: React.FC<DecisionMethodCardProps> = ({
  id,
  title,
  image,
  disabled,
  selected,
}) => {
  const disabledColor = '#FF094E60';
  const gradientColors = disabled
    ? [disabledColor, disabledColor]
    : ['#FF094E', '#F5444E'];
  return (
    <LinearGradient
      colors={['#FF094E', '#F5444E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        tw`rounded-xl justify-center items-center p-2 relative`,
        {
          width: CARD_SIZE,
          height: CARD_SIZE * 0.7,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {/* top info and lock icons */}
      <View style={tw`absolute top-2 left-2 flex-row justify-between w-full`}>
        {/* Info icon */}
        <View
          style={tw`w-6 h-6 bg-white rounded-full justify-center items-center`}
        >
          <Image
            source={Images.info}
            style={tw`w-3.5 h-3.5`}
            resizeMode="contain"
          />
        </View>

        {/* Checkmark or lock */}
        {disabled ? (
          <Image
            source={Images.pwlock}
            style={tw`w-6 h-6 tint-white`}
            resizeMode="contain"
          />
        ) : selected === id ? (
          <View
            style={tw`w-6 h-6 bg-white rounded-full justify-center items-center`}
          >
            <Image
              source={Images.tick}
              style={tw`w-3.5 h-3.5 `}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={tw`w-6 h-6`} /> // keeps layout consistent
        )}
      </View>

      {/* main content */}
      <View style={tw`flex-1 justify-center items-center`}>
        {image && (
          <View
            style={tw`bg-white rounded-full justify-center items-center my-2 p-2`}
          >
            <Image source={image} style={tw`w-8 h-8`} resizeMode="contain" />
          </View>
        )}
        <Text style={tw`text-white font-bold text-center`}>{title}</Text>
      </View>
    </LinearGradient>
  );
};

export default DecisionMethodCard;
