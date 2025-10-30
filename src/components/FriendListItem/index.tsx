import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Button from '../Button';
import tw from '../../lib/tailwind';
import Images from '../../constant/Images';
import FriendshipStatusButton from '../FriendshipStatusButton';
import { useNavigation } from '@react-navigation/native';

export type User = {
  id: string | number;
  playerName: string;
  phoneNumber?: string;
  email?: string;
  profilePicture?: string;
  friendshipStatus:
    | 'not_friend'
    | 'request_sent'
    | 'request_received'
    | 'friend'
    | 'rejected'
    | null;
};

type Variant = 'friends' | 'bet' | 'main';

type FriendListItemProps = {
  user: User;
  variant: Variant;
  onAddFriend?: (id: string) => void;
  onRemoveFriend?: (id: string) => void;
  onAddToBet?: (user: User) => void;
};

const FriendListItem: React.FC<FriendListItemProps> = ({
  user,
  variant,
  onAddFriend,
  onRemoveFriend,
  onAddToBet,
}) => {
  const navigation = useNavigation();
  const profilePicture = user.profilePicture
    ? { uri: user.profilePicture }
    : Images.avatar;
  return (
    <View style={tw`mb-3`}>
      <View style={tw`flex-row items-center py-3`}>
        <Pressable
          onPress={() => {
            navigation.navigate('FriendProfileStack', {
              screen: 'FriendProfile',
              params: { user },
            });
          }}
        >
          <Image
            source={profilePicture}
            style={tw`w-12 h-12 rounded-full mr-3 border-[#FF094E] border-2`}
          />
        </Pressable>
        <View style={tw`flex-1 mr-2`}>
          <Text style={tw`font-bold text-black text-sm`}>
            {user?.playerName}
          </Text>
          <Text style={tw`font-medium text-[#989898] text-xs`}>
            {user?.phoneNumber}
          </Text>
          <Text style={tw`font-medium text-[#989898] text-xs`}>
            {user?.email}
          </Text>
        </View>

        {/* Conditional button based on variant */}
        {variant === 'main' && (
          <FriendshipStatusButton
            status={user.friendshipStatus}
            onAddFriend={() => onAddFriend?.(user?.id)}
          />
        )}
        {variant === 'friends' && (
          <Button
            title="Remove"
            variant="outlined"
            textStyle={tw`font-regular text-sm`}
            containerStyle={tw`py-[0.5]`}
            onPress={() => onRemoveFriend?.(user?.id)}
          />
        )}

        {variant === 'bet' && (
          <Button
            title="Select"
            onPress={e => {
              e?.stopPropagation?.();
              onAddToBet?.(user);
            }}
          />
        )}
      </View>

      {/* Divider */}
      <LinearGradient
        colors={['rgba(246, 68, 78, 0)', '#F6444E', 'rgba(246, 68, 78, 0)']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={tw`h-[1px] w-full`}
      />
    </View>
  );
};

export default FriendListItem;
