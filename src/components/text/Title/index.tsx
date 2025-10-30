import React from 'react';
import { StyleProp,Text, TextStyle } from 'react-native';

import { Colors } from '../../../constant/Colors';
import { Fonts } from '../../../constant/Fonts';

interface TitleProps {
  text: string;
  color?: string;
  font?: string;
  style?: StyleProp<TextStyle>;
  size?: number;
  lineHeight?: number;
}

const Title: React.FC<TitleProps> = ({
  text,
  color = Colors.black,
  font = Fonts.Funnelsemibold,
  style,
  size = 18, // ✅ default heading size
  lineHeight,
}) => {
  return (
    <Text
      style={[
        {
          fontFamily: font,
          fontSize: size,
          lineHeight: lineHeight || size * 1.4,
          color,
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
};

export default Title;
