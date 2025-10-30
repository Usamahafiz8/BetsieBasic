import React from "react";
import { Text, TextStyle,TouchableOpacity, View, ViewStyle } from "react-native";

import tw from "../../lib/tailwind";

type InfoRowProps = {
  icon: React.ReactNode;
  label?: string; // Made optional as it's not needed in this layout
  value?: string;
  action?: string;
  onActionPress?: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

const InfoRow = ({ icon, label, value, action, onActionPress, containerStyle, textStyle }: InfoRowProps) => {
  return (
    <View style={[tw`flex-row items-center`, containerStyle]}>
      {label && <Text style={[tw`ml-2 text-sm text-black font-bold`, textStyle]}>{label}</Text>}
      {icon}
      {action ? (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={tw`text-gradientColor100 font-semibold ml-2`}>{action}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={tw`text-sm text-black ml-2`}>{value}</Text>
      )}
    </View>
  );
};

export default InfoRow;