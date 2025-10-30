import React, { useState } from 'react';
import { Image,TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TextInput as PaperInput, TextInputProps } from 'react-native-paper';

import { Colors } from '../../constant/Colors';
import { Fonts } from '../../constant/Fonts';
import Images from '../../constant/Images';
import tw from '../../lib/tailwind';

interface InputFieldProps extends TextInputProps {
  icon?: any;
  isPassword?: boolean;
}

const Input: React.FC<InputFieldProps> = ({
  label,
  icon,
  isPassword = false,
  value,
  onChangeText,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={tw`mb-6`}>
      {/* Gradient border wrapper */}
      <LinearGradient
        colors={isFocused ? [Colors.gradientColor100, Colors.gradientColor0] : [Colors.gradientColor100, Colors.gradientColor0]} // Change colors on focus
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={tw`p-[1.5px] rounded-md`}
      >
        <View style={tw`flex-row items-center bg-white rounded-md`}>
          {/* Icon */}
          {icon && (
            <Image
              source={icon}
              style={[tw`w-[22px] h-[22px] ml-3 mr-2`, { resizeMode: 'contain' }]}
            />
          )}

          {/* Floating Label Input */}
          <PaperInput
            {...props}
            mode="flat" // Use 'flat' mode to remove native border
            label={label}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={isPassword && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            underlineColor="transparent" // Hide the underline from flat mode
            activeUnderlineColor="transparent"
            style={[
              tw`flex-1 text-black text-[16px] bg-transparent`,
              { fontFamily: Fonts.FunnelRegular, height: 50 }, // Set a fixed height for consistent spacing
            ]}
            theme={{
              colors: {
                text: '#000',
                placeholder: '#aaa',
                primary: '#F5444E', // cursor + floating label color
              },
              roundness: 2,
            }}
          />

          {/* Password Toggle */}
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={tw`mr-3`}
            >
              <Image
                source={showPassword ? Images.eyeVisible : Images.eyeInvisible}
                style={[tw`w-6 h-6`, { resizeMode: 'contain' }]}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default Input;
