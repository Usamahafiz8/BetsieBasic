import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import tw from '../../lib/tailwind';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  variant?: 'filled' | 'outlined';
  icon?: any;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  textStyle,
  containerStyle,
  loading = false,
  disabled,
  variant = 'filled',
  icon,
  iconPosition = 'left', 
  ...props
}) => {
  const isOutlined = variant === 'outlined';
const disabledColor = '#FF094E60';
const gradientColors = disabled
    ? [disabledColor, disabledColor]
    : ['#FF094E', '#F5444E'];
  return (
    <TouchableOpacity {...props} activeOpacity={0.8} disabled={disabled || loading}>
      {isOutlined ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[tw`p-[0.7px] rounded-md`, containerStyle]}
        >
          <View style={tw`bg-white rounded-md px-4 py-1.8 flex-row justify-center items-center`}>
            {icon && iconPosition === 'left' && (
              <Image source={icon} style={tw`w-4 h-4 mr-2`} />
            )}
            <Text
              style={[
                tw`text-black font-semibold text-center text-lg`,
                textStyle,
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Image source={icon} style={tw`w-4 h-4 ml-2`} />
            )}
          </View>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[tw`px-4 py-2 rounded-md`, containerStyle]}
        >
          {loading ? (
            <View style={tw`py-1`}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <View style={tw`flex-row justify-center items-center px-4`}>
              {icon && iconPosition === 'left' && (
                <Image source={icon} style={tw`w-4 h-4 mr-2`} />
              )}
              <Text
                style={[
                  tw`text-white font-semibold text-center text-lg`,
                  textStyle,
                ]}
              >
                {title}
              </Text>
              {icon && iconPosition === 'right' && (
                <Image source={icon} style={tw`w-4 h-4 ml-2`} />
              )}
            </View>
          )}
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

export default Button;
