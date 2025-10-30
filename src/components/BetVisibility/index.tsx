import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';

import tw from '../../lib/tailwind';
import Images from '../../constant/Images';

interface ViewabilityBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  value: 'private' | 'friends-only' | 'public';
  onChange: (val: 'private' | 'friends-only' | 'public') => void;
}

const ViewabilityBottomSheet: React.FC<ViewabilityBottomSheetProps> = ({
  visible,
  onClose,
  value,
  onChange,
}) => {
  const options = [
    {
      label: 'Just Us (Private)',
      value: 'private',
      icon: Images.pwlock,
      disabled: false,
    },
    {
      label: 'Just Friends',
      value: 'friends-only',
      icon: Images.friendlist,
      disabled: false,
    },
    {
      label: 'Everyone and your mom (public)',
      value: 'public',
      icon: Images.earth,
      disabled: true,
    },
  ];

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={tw`justify-end m-0`}
    >
      <View style={tw`bg-white rounded-t-2xl p-5`}>
        <Text style={tw`text-lg font-semibold text-center mb-4`}>
          Who Can See This?
        </Text>

        {options.map(item => (
          <TouchableOpacity
            key={item.value}
            disabled={item.disabled}
            onPress={() => {
              if (!item.disabled) {
                onChange(item.value);
                onClose();
              }
            }}
            style={tw`flex-row items-center justify-between py-3 ${
              item.disabled ? 'opacity-40' : ''
            }`}
          >
            <View style={tw`flex-row items-center`}>
              <Image
                source={item.icon}
                resizeMethod="contain"
                style={tw`w-8 h-8`}
                tintColor={'#F5444E'}
              />
              <Text style={tw`ml-3 text-base text-black`}>{item.label}</Text>
            </View>

            {/* {value === item.value && !item.disabled && (
              // <Icon name="check" size={20} color="#FF094E" />
            )} */}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

export default ViewabilityBottomSheet;
