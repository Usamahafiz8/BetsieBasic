import React from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import Images from '../../../../constant/Images';
import tw from '../../../../lib/tailwind';
import GradientText from '../../../../components/GradientText';

dayjs.extend(utc);
dayjs.extend(timezone);
interface BetCardProps {
  avatar?: string | number;
  name: string;
  description: string;
  date: string; // full date (expiresAt)
  status: string;
  onPress?: () => void;
}

const PendingBetsCard: React.FC<BetCardProps> = ({
  avatar,
  name,
  description,
  date,
  status,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={tw`bg-white rounded-lg`}>
        {/* Avatar + Name */}
        <View style={tw`flex-row`}>
          <Image
            source={
              typeof avatar === 'string'
                ? { uri: avatar }
                : Images.avatar
            }
            // source={avatar ?? Images.avatar}
            style={tw`w-16 h-16 rounded-full`}
          />

          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-bold text-black ml-4`}>{name}</Text>
            <Text style={tw`text-black text-sm ml-4`} numberOfLines={10}>
              {description}
            </Text>
          </View>
        </View>

        {/* Date + Consensus */}
        <View style={tw`flex-row items-center justify-between mt-2 `}>
          {dayjs(date).isBefore(dayjs()) ? (
            <View style={tw`flex-row items-center`}>
              <Image
                source={Images.expire}
                style={tw`w-5 h-5 mr-1`}
                resizeMode="contain"
              />
              <GradientText
                text="Bet expired"
                style={tw`font-regular text-sm`}
              />
            </View>
          ) : (
            <View style={tw`flex-row items-center`}>
              <Image
                source={Images.calendars}
                style={tw`w-4 h-4 mr-1`}
                resizeMode="contain"
              />
             <Text>{dayjs(date).format('MMM DD, YYYY | hh:mm A')}</Text>
            </View>
          )}

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
      </View>
    </TouchableOpacity>
  );
};

export default PendingBetsCard;
