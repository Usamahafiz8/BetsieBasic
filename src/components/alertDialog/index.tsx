import React from 'react';
import {Pressable, Text, View } from 'react-native';
import tw from '../../lib/tailwind';
import GradientBorder from '../../components/GradientBorder';
import Modal from 'react-native-modal';
import { Animations, Direction } from 'react-native-modal';

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  okay?: string;
  decline?: string;
  onConfirm: () => void;
  onCancel: () => void;
  // Custom animation properties
  swipeDirection?: Direction | (Direction[]) | undefined;
}

const alertDialog: React.FC<ConfirmModalProps> = ({
  visible,
  title = 'title',
  message = 'message',
  okay = 'Yes',
  decline = 'No',
  onConfirm,
  onCancel,
  // Double type assertion is used here to fix the TypeScript error.
  swipeDirection = undefined,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onCancel}
      onSwipeComplete={onCancel}
      swipeDirection={swipeDirection}
      // animationIn={animationIn}
      // animationOut={animationOut}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
    >
      <View style={tw`flex-1 justify-center items-center`}>
        <GradientBorder style={tw`bg-white p-6 w-4/5 py-20`}>
          <Text style={tw`text-xl font-semibold text-center mb-4`}>{title}</Text>
          <Text style={tw`text-center font-regular text-lg mb-6`}>{message}</Text>
          <View style={tw`flex-row justify-between`}>
            <Pressable
              onPress={onCancel}
              style={tw`flex-1 border border-red-400 rounded-xl py-2 mr-2`}
            >
              <Text style={tw`text-center font-semibold`}>
                {decline}
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={tw`flex-1 bg-red-500 rounded-xl py-2 ml-2`}
            >
              <Text style={tw`text-center text-white font-semibold`}>
                {okay}
              </Text>
            </Pressable>
          </View>
        </GradientBorder>
      </View>
    </Modal>
  );
};

export default alertDialog;
