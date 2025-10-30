import React from 'react';
import { Image, Text, TouchableOpacity,View } from 'react-native';

import tw from '../../lib/tailwind';
import Button from '../Button';
import GradientText from '../GradientText';
import Images from '../../constant/Images';

interface HeaderProps {
  title?: string;
  onPress?: () => void;
  showBack?: boolean;
  showChat?: boolean; 
  onChatPress?: () => void; 
}

const Header: React.FC<HeaderProps> = ({
  onPress,
  title,
  showBack = false,
  showChat = false,
  onChatPress,
}) => {
  return (
    <>
      <View style={tw`flex-row justify-between items-center px-6 pt-2`}>
        {showBack ? (
          // Back Header
          <TouchableOpacity style={tw`flex-row items-center`} onPress={onPress}>
            <Image
              source={Images.back}
              style={tw`w-3 h-3`}
              resizeMode="contain"
            />
            <Text style={tw`text-lg font-regular ml-1`}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={tw`flex-row items-center gap-1`}>
            <Image
              source={Images.logo} // replace with your Betsie logo
              style={tw`h-8 w-8`}
              resizeMode="contain"
            />
            <GradientText style={tw`font-semibold text-2xl`} text="Betsie" />
          </View>
        )}

        {showChat ? (
          <TouchableOpacity
            onPress={onChatPress}
            style={tw`p-2 rounded-full`}
          >
            <Image
              source={Images.chat} // 👈 make sure you have this icon in Images
              style={tw`w-6 h-6`}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : title ? (
        showBack ? (
          <Button
              title={title}
              textStyle={tw`font-regular text-sm`}
              variant="outlined"
              disabled
            />
          ) : (
            <Button
              title={title}
              textStyle={tw`font-regular text-sm`}
              onPress={onPress}
            />
          )) : (
          <View style={tw`w-6`} /> 
        )}
      </View>
      <View style={tw`border-b border-[#FF93A0] py-1 mb-2`} />
    </>
  );
};

export default Header;
