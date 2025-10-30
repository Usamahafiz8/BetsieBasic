// src/components/Bets/CompletedBetsCard.tsx
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import Images from '../../../../constant/Images';
import tw from '../../../../lib/tailwind';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
// Define User type if not imported from elsewhere
type User = {
  id: string;
  name: string;
  avatar?: string | number;
  date: string; // full date (expiresAt)
  status: string;
  onPress?: () => void;

  // Add other fields as needed
};

interface CompletedBetCardProps {
  id: string;
  avatar?: string | number;
  name: string;
  description: string;
  date: string;
  status: string;
  winner?: User; // instead of string
  onPress?: () => void;
}

const CompletedBetsCard: React.FC<CompletedBetCardProps> = ({
  id,
  avatar,
  name,
  description,
  date,
  status,
  onPress,
}) => {
  return (
    <TouchableOpacity style={tw`bg-white rounded-lg`} onPress={onPress}>
      {/* Avatar + Name */}
      <View style={tw`flex-row`}>
        <Image
          source={typeof avatar === 'string' ? { uri: avatar } : Images.avatar}
          // source={avatar ?? Images.avatar}
          style={tw`w-16 h-16 rounded-full`}
        />
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-bold text-black ml-4`}>{name}</Text>
          <Text style={tw`text-black text-sm ml-4`} numberOfLines={3}>
            {description}
          </Text>
        </View>
      </View>

      {/* Date + Consensus */}
      <View style={tw`flex-row items-center justify-between mt-2`}>
        <View style={tw`flex-row items-center`}>
          <Images.calendar
            width={16}
            height={16}
            fill="#374151"
            style={tw`mr-1`}
          />
          <Text>{dayjs(date).format('MMM DD, YYYY | hh:mm A')}</Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <Image
            source={Images.consensus2}
            style={tw`w-4 h-4 mr-1`}
            resizeMode="contain"
          />
          <Text style={tw`text-sm font-semibold text-activeText`}>
            Consensus
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={tw`mt-2`}>
        <LinearGradient
          colors={['rgba(246, 68, 78, 0)', '#F6444E', 'rgba(246, 68, 78, 0)']}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={tw`h-[1px] w-full`}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CompletedBetsCard;
