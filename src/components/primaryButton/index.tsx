import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import tw from '../../lib/tailwind';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  loading = false,
  disabled = false,
  textStyle,
  containerStyle,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      <LinearGradient
        colors={['#FF094E', '#F5444E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          tw`px-6 py-3 rounded-md flex-row justify-center items-center`,
          containerStyle,
          disabled && tw`opacity-50`,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text
            style={[
              tw`text-white font-semibold text-center text-xl`,
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
