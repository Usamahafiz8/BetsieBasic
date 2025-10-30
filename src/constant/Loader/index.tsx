import React, { useEffect } from 'react';
import { Image,View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import LinearGradientColor from '../../components/LinearGradientColor';
import Images from '../../constant/Images';
import tw from '../../lib/tailwind';

interface LoaderProps {
  size?: number;
}

export default function Loader({ size = 50 }: LoaderProps) {
  return null;
}
