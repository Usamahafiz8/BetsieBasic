import { Dimensions, View } from 'react-native';
import React, {
  ReactNode,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import tw from '../../lib/tailwind';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;
export type PopUpRef = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

type PopUpProps = {
  children: ReactNode;
};

const PopUp = forwardRef<PopUpRef, PopUpProps>(
  ({ children }, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
      'worklet';
      active.value = destination !== 0;
      translateY.value = withSpring(destination, { damping: 50 });
    }, []);

    const isActive = useCallback(() => active.value, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({ y: 0 });

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd(() => {
        if (translateY.value > -SCREEN_HEIGHT / 3) {
          scrollTo(0);
        } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
          scrollTo(MAX_TRANSLATE_Y);
        }
      });

    const rPopUpStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 5],
        Extrapolation.CLAMP
      );

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            tw`absolute w-full bg-white`,
            {
              height: SCREEN_HEIGHT,
              top: SCREEN_HEIGHT,
            },
            rPopUpStyle,
          ]}
        >
          <View style={tw`w-18 h-1 bg-gray-400 self-center my-4 rounded`} />
          {children}
        </Animated.View>
      </GestureDetector>
    );
  }
);

export default PopUp;