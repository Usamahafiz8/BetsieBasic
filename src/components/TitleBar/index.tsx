// src/components/TitleBar.tsx
import React from 'react';
import { Text, TouchableOpacity,View } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import tw from '../../lib/tailwind';

import { Colors } from '../../constant/Colors';
import LinearGradientColor from '../LinearGradientColor';

const TitleBar = () => {
  return (
    <View style={tw`flex-row items-center justify-between px-4 py-3 bg-white`}>
      {/* Left Logo */}
      <Text style={[tw`text-xl font-bold`, { color: Colors.darkStorke }]}>
        Betsie
      </Text>

      {/* Create New Button */}
       <LinearGradientColor variant="button" style={tw`rounded-full`}>
        <TouchableOpacity style={tw`px-4 py-2`}>
          <Text style={tw`text-white font-semibold`}>Create New</Text>
        </TouchableOpacity>
      </LinearGradientColor>
    </View>
  );
};

export default TitleBar;
