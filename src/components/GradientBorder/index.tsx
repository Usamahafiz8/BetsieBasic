import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import tw from '../../lib/tailwind';


type GradientBorderProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
};

const GradientBorder: React.FC<GradientBorderProps> = ({
  children,
  style,
  borderRadius = 8, // default rounded-md
}) => {
  return (
    <LinearGradient
      colors={['#FF094E', '#F5444E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[tw`p-[1px] rounded-md`, { borderRadius }]}
    >
      <View style={[tw`bg-white rounded-md px-2`, { borderRadius }, style]}>
        {children}
      </View>
    </LinearGradient>
  );
};

export default GradientBorder;
