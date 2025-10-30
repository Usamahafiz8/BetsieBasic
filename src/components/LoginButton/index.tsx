import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import tw from '../../lib/tailwind';


interface LoginButtonProps extends TouchableOpacityProps {
  title: string;
  icon: any; // require image
}

const LoginButton: React.FC<LoginButtonProps> = ({ title, icon, ...props }) => {
  return (
    <LinearGradient
      colors={['#FF094E', '#F5444E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={tw`flex-1 p-[1px] rounded-md mx-1`}
    >
      <View style={tw`bg-white rounded-md`}>
        <TouchableOpacity
          {...props}
          style={tw` items-center justify-between py-1`}
          activeOpacity={0.8}
        >
          <Image source={icon} style={tw`w-6 h-6`} resizeMode="contain" />
          <Text style={tw`font-regular text-black`}>{title}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default LoginButton;
