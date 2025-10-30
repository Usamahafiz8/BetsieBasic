import React from 'react';
import { Text,View } from 'react-native';
import tw from '../../lib/tailwind';

const ResponsiveComponent = () => {
  return (
    <View style={tw`flex-col md:flex-row items-center justify-center p-4 md:p-8 bg-gray-100`}>
      <Text style={tw`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold`}>
        This text size is responsive!
      </Text>
      <View style={tw`w-full md:w-1/2`}>
        <Text style={tw`mt-4 md:mt-0 md:ml-4 text-sm sm:text-base`}>
          This container will adjust its size and spacing.
        </Text>
      </View>
    </View>
  );
};

export default ResponsiveComponent;