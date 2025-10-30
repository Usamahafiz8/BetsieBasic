import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import tw from '../../lib/tailwind';

const Separator = () => {
  return (
    <View style={tw`flex-row items-center mb-6 w-full`}>
      <LinearGradient
        colors={['rgba(246, 68, 78, 0)', '#F6444E', 'rgba(246, 68, 78, 0)']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={tw`h-[1px] w-full`}
      />
    </View>
  );
};

export default Separator;
