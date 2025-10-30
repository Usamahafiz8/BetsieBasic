
import React from 'react';
import { Image, Text, TouchableOpacity,View } from 'react-native';

import Images from '../../constant/Images';
import tw from '../../lib/tailwind';
import LinearGradientColor from '../LinearGradientColor';
import Content from '../text/Content';

interface MainHeaderProps {
  onBackPress?: () => void;
  title?: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({ onBackPress, title }) => {
  return (
    <>
      <View style={tw`flex-row justify-between items-center px-6 mt-5`}>
        <View style={tw`flex-row items-center `}>
          {onBackPress && (
            <TouchableOpacity onPress={onBackPress} style={tw`mr-1`}>
              <Image
                source={Images.back} // <-- make sure you have a back icon in your Images constant
                style={tw`h-4 w-4`}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
      
          <Content
            style={tw`font-semibold text-xl `}
            text="Back"
          />
        </View>
        {/* {title ? <Text style={tw`text-lg font-semibold`}>{title}</Text> : null} */}
      </View>
      <View style={tw`border-b border-[#FF93A0] py-2`} />
    </>
  );
};

export default MainHeader;
