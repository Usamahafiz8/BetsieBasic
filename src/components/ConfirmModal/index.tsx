import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import tw from '../../lib/tailwind';
import GradientBorder from '../GradientBorder';


interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = 'Confirmation',
  message = 'Are you sure?',
  confirmText = 'Yes',
  cancelText = 'No',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={tw`flex-1 justify-center items-center bg-white/80`}>
        <GradientBorder style={tw`bg-white p-6 w-4/5 py-20`}>
          <Text style={tw`text-xl font-semibold text-center mb-4`}>{title}</Text>
          <Text style={tw`text-center font-regular text-lg mb-6`}>{message}</Text>
          <View style={tw`flex-row justify-between`}>
           {onCancel && <Pressable
              onPress={onCancel}
              style={tw`flex-1 border border-red-400 rounded-xl py-2 mr-2`}
            >
              <Text style={tw`text-center font-semibold`}>
                {cancelText}
              </Text>
            </Pressable>}
            <Pressable
              onPress={onConfirm}
              style={tw`flex-1 bg-red-500 rounded-xl py-2 ml-2`}
            >
              <Text style={tw`text-center text-white font-semibold`}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </GradientBorder>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
