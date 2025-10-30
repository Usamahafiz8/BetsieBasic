import MaskedView from "@react-native-masked-view/masked-view";
import React from "react";
import {
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { Colors } from "../../constant/Colors";
import tw from "../../lib/tailwind";

type GradientVariant =
  | "button"
  | "title"
  | "heading"
  | "content"
  | "inputBorder"
  | "loader";

interface GradientBaseProps {
  colors?: string[];
  variant?: GradientVariant;
  style?: StyleProp<TextStyle | ViewStyle>;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

interface GradientTextProps extends GradientBaseProps {
  text: string;
  children?: never;
}

interface GradientContainerProps extends GradientBaseProps {
  text?: never;
  children: React.ReactNode;
}

type GradientProps = GradientTextProps | GradientContainerProps;

const gradientPresets: Record<GradientVariant, string[]> = {
  button: [Colors.gradientColor0, Colors.gradientColor100],
  title: [Colors.gradientColor0, Colors.gradientColor100],
  heading: [Colors.gradientColor0, Colors.gradientColor100],
  content: [Colors.gradientColor0, Colors.gradientColor100],
  inputBorder: [Colors.gradientColor0, Colors.gradientColor100],
  loader: [Colors.gradientColor0, Colors.gradientColor100],
};

const LinearGradientColor: React.FC<GradientProps> = ({
  text,
  children,
  style,
  colors,
  variant,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
}) => {
  const gradientColors =
    colors ||
    (variant ? gradientPresets[variant] : [Colors.gradientColor0, Colors.gradientColor100]);

  // ✅ Text Gradient Mode
  if (text) {
    return (
      <MaskedView
        maskElement={
          <Text style={[tw`text-lg`, style, { backgroundColor: "transparent" }]}>
            {text}
          </Text>
        }
      >
        <LinearGradient colors={gradientColors} start={start} end={end}>
          <Text style={[tw`opacity-0`, style]}>{text}</Text>
        </LinearGradient>
      </MaskedView>
    );
  }

  // ✅ Container Gradient Mode
  return (
    <LinearGradient colors={gradientColors} start={start} end={end} style={style as ViewStyle}>
      {children}
    </LinearGradient>
  );
};

export default LinearGradientColor;
