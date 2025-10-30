import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import Images from '../../../../constant/Images';
import tw from '../../../../lib/tailwind';

interface BetCardProps {
  avatar?: string | number;
  name: string;
  description: string;
  date: string;
  status: string; 
}

const BetCard: React.FC<BetCardProps> = ({
  avatar,
  name,
  description,
  date,
  status,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 min = 600 sec

  useEffect(() => {
    if (status !== 'Pending') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  // ✅ Fixed: show MM:SS instead of HH:MM
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={tw`bg-white rounded-lg p-4`}>
      {/* Avatar + Name */}
      <View style={tw`flex-row`}>
        <Image
          source={typeof avatar === 'string' ? { uri: avatar } : avatar || Images.profile}
          style={tw`w-16 h-16 rounded-full`}
        />
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-bold text-black ml-4`}>{name}</Text>
          <Text style={tw`text-black text-sm ml-4`} numberOfLines={10}>
            {description}
          </Text>
        </View>
      </View>

      {/* Timer / Date + Consensus */}
      <View style={tw`flex-row items-center justify-between mt-2`}>
        <View style={tw`flex-row items-center`}>
          {status === 'Pending' ? (
            <>
              <Text style={tw`text-sm text-red-600 font-bold`}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={tw`text-sm text-black ml-2`}>
                Time remaining
              </Text>
            </>
          ) : (
            <>
              <Images.calendar width={16} height={16} fill="#374151" style={tw`mr-1`} />
              <Text style={tw`text-sm text-black`}>{date}</Text>
            </>
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
  );
};

export default BetCard;
