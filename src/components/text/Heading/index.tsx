import React from 'react';
import { 
    StyleProp, 
    Text, 
    TextStyle} from 'react-native';

import { Colors } from '../../../constant/Colors';
import { Fonts } from '../../../constant/Fonts';

interface TitleProps {
  text: string;
  color?: string; 
  font?: keyof typeof Fonts; 
  style?: StyleProp<TextStyle>;
  size?: number; 
}

const Heading: React.FC<TitleProps> = ({
  text,
  color = Colors.black,
  font = 'FunnelExtraBold',
  style,
  size = 64,
}) => {
  return (
    <Text
      style={[
        {
          fontFamily: Fonts[font],
          fontSize: size,
          lineHeight: size,
          color,
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
};

export default Heading;
