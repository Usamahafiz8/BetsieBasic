import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-reanimated';

import LinearGradientColor from '../../components/LinearGradientColor';
import Content from '../../components/text/Content';
import Title from '../../components/text/Title';
import { Colors } from '../../constant/Colors';
import Images from '../../constant/Images';
import tw from '../../lib/tailwind';
 
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const alertIcons: Record<string, ImageSourcePropType> = {
  danger: Images.danger,
  warning: Images.warning,
  success: Images.success,
  information: Images.information,
};

const alertColors: Record<
  string,
  { background: string; outerCircle: string; title: string; message: string }
> = {
  danger: {
    background: Colors.alertDangerBackground,
    outerCircle: Colors.alertDangerOuterCircle,
    title: Colors.alertDangerTitle,
    message: Colors.alertDangerMessage,
  },
  warning: {
    background: Colors.alertWarningBackground,
    outerCircle: Colors.alertWarningOuterCircle,
    title: Colors.alertWarningTitle,
    message: Colors.alertWarningMessage,

  },
  success: {
    background: Colors.alertSuccessBackground,
    outerCircle: Colors.alertSuccessOuterCircle,
    title: Colors.alertSuccessTitle,
    message: Colors.alertSuccessMessage,
  },
  information: {
    background: Colors.alertInformationBackground,
    outerCircle: Colors.alertInformationOuterCircle,
    title: Colors.alertInformationTitle,
    message: Colors.alertInformationMessage,
  },
};

interface ButtonProps {
  label: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
}

interface AlertMessageBoxProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'success' | 'information';
  buttons?: ButtonProps[];
  logo?: ImageSourcePropType;
}

const AlertMessageBox: React.FC<AlertMessageBoxProps> = ({
  visible,
  onDismiss,
  title,
  message,
  type,
  buttons = [{ label: 'OK', onPress: onDismiss }],
  logo,
}) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const colors = alertColors[type] || alertColors.information;
  const iconSource = logo || alertIcons[type];

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View
        style={[
          tw`flex-1 justify-center items-center bg-black bg-opacity-50`,
          animatedStyle,
        ]}
      >
        {/* Outer container with background */}
        <LinearGradientColor
          colors={[colors.background, colors.background]}
          style={tw`w-11/12 rounded-2xl p-6 pt-16 relative`}
        >
          {/* Circular logo container, absolute positioned */}
          <View
            style={[
              tw`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full items-center justify-center`,
              { backgroundColor: colors.outerCircle, zIndex: 10, elevation: 10 },
            ]}
          >
            {iconSource && (
              <Image
                source={iconSource}
                style={tw`w-12 h-12`}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Title */}
          <Title
            style={[tw`text-center mb-4`, { color: colors.title }]}
            text={title}
          />

          {/* Message */}
          <Text
            style={[
              tw`text-center text-base mb-6 px-4`,
              { color: colors.message, lineHeight: 22 },
            ]}
          >
            {message}
          </Text>

          {/* Buttons */}
          <View style={tw`flex-row justify-center space-x-4`}>
            {buttons.map(({ label, onPress, style, textStyle }, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  onPress();
                  runOnJS(onDismiss)();
                }}
                activeOpacity={0.7}
                style={[
                  tw`flex-1 py-3 rounded-lg items-center justify-center`,
                  style || tw`bg-gray-200`,
                  i === 0 && !style ? tw`bg-gray-300` : null,
                ]}
              >
                <Text
                  style={[tw`font-semibold text-base`, textStyle || tw`text-black`]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradientColor>
      </Animated.View>
    </Modal>
  );
};

export default AlertMessageBox;
