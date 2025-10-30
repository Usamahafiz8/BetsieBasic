import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import tw from '../../lib/tailwind';

type StatusButtonProps = {
  status: 'not_friend' | 'request_sent' | 'friend' | 'request_received' | null;
  onAddFriend: () => void;
};

const FriendshipStatusButton: React.FC<StatusButtonProps> = ({
  status,
  onAddFriend,
}) => {
  const baseStyle = `px-2 py-2 rounded-lg w-[35%] items-center`;

  switch (status) {
    case null:
      return (
        <TouchableOpacity
          style={tw`${baseStyle} bg-[#FF094E]`}
          onPress={onAddFriend}
        >
          <Text style={tw`text-white font-regular text-sm`}>Add Friend</Text>
        </TouchableOpacity>
      );
    case 'not_friend':
      return (
        <TouchableOpacity
          style={tw`${baseStyle} bg-[#FF094E]`}
          onPress={onAddFriend}
        >
          <Text style={tw`text-white font-regular text-sm`}>Add Friend</Text>
        </TouchableOpacity>
      );

    case 'request_sent':
      return (
        <View style={tw`${baseStyle} bg-[#989898]`}>
          <Text style={tw`text-white font-regular text-sm`}>Request Sent</Text>
        </View>
      );
    case 'request_received':
      return (
        <View style={tw`${baseStyle} bg-[#989898]`}>
          <Text style={tw`text-white font-regular text-sm`}>Request Received</Text>
        </View>
      );
    case 'friend':
      return (
        <View style={tw`${baseStyle} bg-[#989898]`}>
          <Text style={tw`text-white font-regular text-sm`}>Friends</Text>
        </View>
      );
  }
};

export default FriendshipStatusButton;
