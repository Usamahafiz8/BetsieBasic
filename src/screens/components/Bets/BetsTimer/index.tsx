import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import tw from "../../../../lib/tailwind";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BetsTimerProps {
  targetDate: Date;
}

const AnimatedDigit = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (value === displayValue) return;

    translateY.value = withSequence(
      withTiming(-SCREEN_HEIGHT * 0.03, { duration: 0 }), // smaller jump
      withTiming(0, { duration: 250 }, () => {
        runOnJS(setDisplayValue)(value);
      })
    );
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text style={tw`text-white font-bold text-lg`}>
        {value.toString().padStart(2, "0")}
      </Text>
    </Animated.View>
  );
};

const renderTimeBox = (val: number, unit: string) => (
  <LinearGradient
    colors={["#FB194E", "#F5444E"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={tw`px-1.5 py-0.5 rounded-md mx-1 items-center`}
  >
    <AnimatedDigit value={val} />
    {unit ? <Text style={tw`text-white text-2xs mt-0.5`}>{unit}</Text> : null}
  </LinearGradient>
);

export const BetsTimer = ({ targetDate }: BetsTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <View style={tw`flex-row justify-center items-center`}>
      {renderTimeBox(timeLeft.hours, "")}
      <Text style={tw`text-gradientColor0 font-bold text-base mx-0.5`}>:</Text>
      {renderTimeBox(timeLeft.minutes, "")}
      {/* Uncomment if seconds needed */}
      {/* <Text style={tw`text-white font-bold text-base mx-0.5`}>:</Text>
      {renderTimeBox(timeLeft.seconds, "")} */}
    </View>
  );
};
