import React from 'react';
import { StyleProp,Text, TextStyle } from 'react-native';

import { Colors } from '../../../constant/Colors';
import { Fonts } from '../../../constant/Fonts';

interface ContentProps {
  text: string;
  color?: string;
  font?: string;
  style?: StyleProp<TextStyle>;
  size?: number;
  lineHeight?: number;
}

const Content: React.FC<ContentProps> = ({
  text,
  color = Colors.black, // ✅ softer body color
  font = Fonts.FunnelRegular, // ✅ lighter font
  style,
  size = 14,
  lineHeight,
}) => {
  return (
    <Text
      style={[
        {
          fontFamily: font,
          fontSize: size,
          lineHeight: lineHeight || size * 1.6,
          color,
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
};

export default Content;
