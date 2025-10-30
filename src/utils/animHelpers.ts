import { Animated, Easing } from "react-native";

/** Utility animation helpers */
export const fadeIn = (anim: Animated.Value, toValue = 1, duration = 300) =>
    Animated.timing(anim, { toValue, duration, useNativeDriver: true });

export const moveTo = (anim: Animated.Value, toValue: number, duration = 500) =>
    Animated.timing(anim, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

export const springTo = (anim: Animated.Value, toValue: number, friction = 4) =>
    Animated.spring(anim, { toValue, friction, useNativeDriver: true });