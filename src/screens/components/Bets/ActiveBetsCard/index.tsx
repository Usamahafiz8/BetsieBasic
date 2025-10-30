// src/components/Bets/ActiveBetsCard.tsx
import React, { FC } from 'react';
import {
  View,
  Image,
  Pressable,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import { BetsTimer } from '../../Bets/BetsTimer';
import Images from '../../../../constant/Images';
import tw from '../../../../lib/tailwind';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
export interface ActiveBetsCardProps {
  id: string;
  avatar: string;
  name: string;
  description: string;
  startTime?: string;
  endTime?: string; // expiresAt
  status: 'created' | 'accepted' | 'continue' | 'completed';
  onChooseWinner?: (id: string) => void;
  onPressCard?: (id: string) => void; // 👈 new
}

const ActiveBetsCard: FC<ActiveBetsCardProps> = ({
  id,
  avatar,
  name,
  description,
  endTime,
  status,
  onChooseWinner,
  onPressCard,
}) => {
  const now = dayjs();
  const end = endTime ? dayjs(endTime) : null;

  console.log('🚀 ~ ActiveBetsCard ~  avatar:', avatar);
  const isActive = end && now.isBefore(end);
  const isFinished = end && now.isAfter(end);

  // -------- Active Mode (tap whole card → BetDetail) --------
  const renderRunningMode = () => (
    <View style={tw`flex-row items-center justify-between mt-2`}>
      <View style={tw`flex-row items-center`}>
        {end ? (
          <>
            <Image
              source={Images.calendars}
              style={tw`w-4 h-4 mr-1`}
              resizeMode="contain"
            />
            <Text style={tw`text-sm font-regular`}>
              {dayjs(endTime).format('MMM DD, YYYY | hh:mm A')}
            </Text>
          </>
        ) : (
          <Text style={tw`text-sm text-red-600`}>Date unavailable</Text>
        )}
      </View>

      <View style={tw`flex-row items-center`}>
        <Image
          source={Images.consensus2}
          style={tw`w-4 h-4 mr-1`}
          resizeMode="contain"
        />
        <Text style={tw`text-sm font-semibold text-activeText`}>Consensus</Text>
      </View>
    </View>
  );

  // -------- Winner Select Mode (48h countdown) --------
  const renderChooseWinnerMode = () => (
    <View style={tw`flex-row items-center justify-between mt-2`}>
      <View style={tw`flex-row items-center`}>
        {end ? (
          <BetsTimer targetDate={dayjs(end).add(48, 'hour').toDate()} />
        ) : (
          <Text style={tw`text-sm text-red-600`}>Timer unavailable</Text>
        )}

        <Text style={tw`text-sm text-gradientColor0 ml-2`}>Select Winner</Text>
      </View>

      <View style={tw`flex-row items-center`}>
        <Image
          source={Images.consensus2}
          style={tw`w-4 h-4 mr-1`}
          resizeMode="contain"
        />
        <Text style={tw`text-sm font-semibold text-activeText`}>Consensus</Text>
      </View>
    </View>
  );

  return (
    <TouchableOpacity
      style={tw`bg-white rounded-lg mb-4`}
      onPress={
        isFinished ? () => onChooseWinner?.(id) : () => onPressCard?.(id)
      }
    >
      {/* Avatar + Name + Description */}
      <View style={tw`flex-row`}>
        <Image
          source={
            avatar && typeof avatar === 'string' && avatar.trim() !== ''
              ? { uri: avatar }
              : Images.avatar
          }
          style={tw`w-16 h-16 rounded-full`}
        />

        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-bold text-black ml-4`}>{name}</Text>
          <Text style={tw`text-black text-sm ml-4`} numberOfLines={10}>
            {description}
          </Text>
        </View>
      </View>

      {/* Timer / Action Row */}
      {isActive
        ? renderRunningMode()
        : isFinished
        ? renderChooseWinnerMode()
        : null}

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

export default ActiveBetsCard;
