import React from "react";
import { TouchableOpacity, View, Text, Platform, StyleProp, ViewStyle, TextStyle } from "react-native";
import tw from "../../lib/tailwind";

type CheckBoxProps = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  onChange,
  label,
  containerStyle,
  boxStyle,
  labelStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onChange}
      style={[tw`flex-row items-center `, containerStyle]}
      activeOpacity={0.7}
    >
      {/* Box */}
      <View
        style={[
          tw`w-5 h-5 border border-black items-center justify-center bg-white`,
          Platform.OS === "ios" ? tw`rounded-full` : tw`rounded`,
          boxStyle,
        ]}
      >
        {checked && <Text style={tw`text-black text-xs`}>✓</Text>}
      </View>

      {/* Optional Label */}
      {label ? <Text style={[tw`ml-2 text-black text-sm`, labelStyle]}>{label}</Text> : null}
    </TouchableOpacity>
  );
};

export default CheckBox;
