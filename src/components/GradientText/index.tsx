import MaskedView from '@react-native-masked-view/masked-view';
import React from 'react';
import { Text, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import tw from '../../lib/tailwind';
interface GradientTextProps {
  text: string;
  style?: TextStyle;
  colors?: string[];
}

const GradientText: React.FC<GradientTextProps> = ({
  text,
  style,
  colors = ['#FF094E', '#F5444E'],
}) => {
  return (
    <MaskedView
      maskElement={
        <Text style={[tw`text-lg`, style, { backgroundColor: 'transparent' }]}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[tw`opacity-0`, style]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
