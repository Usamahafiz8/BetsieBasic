

import React, { useEffect } from 'react';
import { Image, ImageSourcePropType, Text, View, ViewStyle } from 'react-native';
import { Surface } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-reanimated';

import LinearGradientColor from '../../components/LinearGradientColor';
import { Colors } from '../../constant/Colors';
import Images from '../../constant/Images';
import tw from '../../lib/tailwind';
import { styles } from './styles';

interface AnimatedCustomToastProps {
  message: string;
  image?: ImageSourcePropType;
  style?: ViewStyle;
  borderColors?: string[];
  duration?: number; 
  onHide?: () => void;
}

const CustomToast: React.FC<AnimatedCustomToastProps> = ({
  message,
  image,
  style,
  borderColors,
  duration = 5000,
  onHide,
}) => {
  const translateY = useSharedValue(500);
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  // Animate in on mount
  useEffect(() => {
  translateY.value = withSpring(0, { damping: 20, stiffness: 150 }); 
  scale.value = withTiming(1, { duration: 500 });
  opacity.value = withTiming(1, { duration: 500 });

  const timer = setTimeout(() => {
    translateY.value = withTiming(500, { duration: 500 });
    opacity.value = withTiming(0, { duration:500 }, (finished) => {
      if (finished && onHide) runOnJS(onHide)();
    });
  }, duration);

  return () => clearTimeout(timer);
}, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: '10%',
          alignSelf: 'center',
          width: '100%',
          zIndex: 9999,
        },
        animatedStyle,
      ]}
      // Optionally, you can add gesture handler here if you want to swipe to dismiss
    >
      <LinearGradientColor
        colors={borderColors || [Colors.gradientColor0, Colors.gradientColor100]}
        style={[styles.container, style]}
      >
        <Surface style={[styles.surface, styles.shadow]}>
          <View style={styles.row}>
            <View style={styles.iconbg}>
            <Image
              source={image || Images.betsielogo}
              style={styles.icon}
              resizeMode="contain"
            />
            </View>
            <Text style={styles.text}>
              
              {/* write some text  */}
              {message}
              </Text>
          </View>
        </Surface>
      </LinearGradientColor>
    </Animated.View>
  );
};

export default CustomToast;
