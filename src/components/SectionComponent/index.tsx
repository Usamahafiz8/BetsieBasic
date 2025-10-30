import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import tw from '../../lib/tailwind';

const SectionComponent = () => {
  return (
    <View style={tw`flex-row items-center mb-6 w-full`}>
      {/* Left Gradient */}
      <LinearGradient
        colors={['#F5444E', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0.8, y: 0.5 }}
        style={tw`flex-1 h-3px`}
      />

      {/* Text */}
      <Text style={tw` text-black font-regular`}>or</Text>

      {/* Right Gradient */}
      <LinearGradient
        colors={['transparent', '#F5444E']}
        start={{ x: 0.2, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={tw`flex-1 h-3px`}
      />
    </View>
  );
};

export default SectionComponent;
