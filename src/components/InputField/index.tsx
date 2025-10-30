import React, { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import tw from '../../lib/tailwind';
import Images from '../../constant/Images';


interface InputFieldProps extends TextInputProps {
  label: string;
  icon: any;
  isPassword?: boolean;
  iconColor?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  isPassword = false,
  iconColor,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  return (
    <View style={tw``}>
      <LinearGradient
        colors={['#FF094E', '#F5444E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={tw`p-[1px] rounded-md`}
      >
        <View
          style={tw`flex-row items-center bg-white rounded-md px-3 py-2 relative`}
        >
          <Image
            source={icon}
            style={[tw`w-6 h-6 mr-2`, { resizeMode: 'contain' }]}
            tintColor={iconColor}
          />
          <View style={tw`flex-1 justify-center`}>
            <Text
              style={tw.style(
                `absolute text-sm bg-white px-1 font-normal`,
                isFocused || props.value
                  ? `-top-4 -left-6 text-[#FF094E]`
                  : ` left-1 text-[#989898]`,
              )}
            >
              {label}
            </Text>
            <TextInput
              {...props}
              placeholder=""
              placeholderTextColor="#989898"
              secureTextEntry={!showPassword}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={tw`text-black font-normal`}
            />
          </View>
          {isPassword && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={showPassword ? Images.eyeVisible : Images.eyeInvisible}
                style={[tw`w-5 h-5 ml-2 `, { resizeMode: 'contain' }]}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default InputField;
