import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import LinearGradient from 'react-native-linear-gradient';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import tw from '../../../lib/tailwind';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import Images from '../../../constant/Images';
import GradientText from '../../../components/GradientText';
import { useBetsieStore } from '../../../store/useBetsieStore';
import { baseUrl } from '../../../api/baseUrl';
import { BetsTimer } from '../../components/Bets/BetsTimer';
import ConfirmModal from '../../../components/ConfirmModal';

dayjs.extend(utc);
dayjs.extend(timezone);
type BetStatus = 'active' | 'pending' | 'completed';
interface BetDetailProps {
  bet: {
    status: BetStatus;
    expiresAt?: string;
    createdAt?: string;
  };
}
const BetsResolve: React.FC<BetDetailProps> = () => {
  const route = useRoute();
  const navigation = useNavigation() as any;
  const { bet } = route.params as { bet: any };
  console.log('🚀 ~ BetsResolve ~ bet:', bet);
  const [selectedWinnerId, setSelectedWinnerId] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const { user, token } = useBetsieStore();
  const {
    id,
    status,
    creator,
    opponent,
    description,
    resolutionMethod,
    receiverStake,
    requesterStake,
    visibility,
    expiresAt,
    userStatistics,
  } = bet;
  // :white_tick: API call for resolving bet
  const handleResolveBet = async (winnerId: number | null) => {
    if (!winnerId) {
      Alert.alert(
        'Error',
        'Please select a winner before submitting your vote.',
      );
      return;
    }

    try {
      const requestBody = { betId: id, votedForId: winnerId };
      const response = await fetch(`${baseUrl}/bets/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("🚀 ~ handleResolveBet ~ data:", data.data)

      if (!data.success) {
        if (
          data?.message?.includes(
            'Vote recorded. Both participants must vote before the bet can be resolved.',
          )
        ) {
          // 🟢 Show waiting modal
          setShowMsgModal(true);
        } else {
          Alert.alert('Error', data?.message || 'Failed to resolve bet');
        }
        return;
      }

      navigation.navigate('Winning', {
        bet: data.data,
        highlight: true,
      });
    } catch (error: any) {
      console.log('💥 [handleResolveBet Error]:', error);
      Alert.alert('Error', error?.message || 'Failed to resolve bet');
    }
  };

  useEffect(() => {
    if (bet.votingInfo.length > 0 && bet.votingInfo[0].voterId === user?.id) {
      setShowMsgModal(true);
    }
  }, [bet]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      {/* :white_tick: Added ScrollView */}
      <ScrollView
        style={tw`flex-1 px-4`}
        contentContainerStyle={tw`pb-10`}
        showsVerticalScrollIndicator={false}
      >
        {/* Countdown Timer */}
        {status === 'active' && expiresAt && (
          <View style={tw`items-center mt-4`}>
            <BetsTimer targetDate={dayjs(expiresAt).add(48, 'hour').toDate()} />
            <Text style={tw`mt-2 text-black text-base text-center`}>
              Time remaining to select the Winner.
            </Text>
            <Text style={tw`font-semibold text-xl text-center mt-2`}>
              Select the Winner
            </Text>
            <Text style={tw`mt-2 text-black text-base text-center`}>
              Click the box below to select the winning user.
            </Text>
          </View>
        )}
        {/* Winner Selection Boxes */}
        <View style={tw`flex-row justify-between items-center mt-6 px-2`}>
          {/* Creator */}
          <Pressable
            // onPress={() => handleResolveBet(creator?.id)}
            onPress={() => setSelectedWinnerId(creator?.id)}
            style={tw`flex-1 max-w-[40%] items-center`}
          >
            <LinearGradient
              colors={['#FF094E', '#F5444E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`p-[2px] rounded-2xl w-full`}
            >
              <LinearGradient
                colors={
                  selectedWinnerId === creator?.id
                    ? ['#FF094E', '#F5444E']
                    : ['#FFFFFF', '#FFFFFF']
                }
                style={tw`rounded-2xl items-center justify-center h-30 p-3`}
              >
                <Image
                  source={
                    creator?.profilePicture
                      ? { uri: creator.profilePicture }
                      : Images.avatar
                  }
                  resizeMode="cover"
                  style={tw`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200`}
                />
                <Text
                  style={tw`mt-2 font-bold text-sm md:text-base text-center text-black`}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {creator?.playerName}
                </Text>
              </LinearGradient>
            </LinearGradient>
          </Pressable>
          {/* VS */}
          <View style={tw`flex-col justify-center items-center `}>
            <Text style={tw`text-[#FF094E]  mb-8 font-bold text-lg`}>vs</Text>

            <LinearGradient
              colors={['#FB194E', '#F5444E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`rounded-xl px-4 py-2 justify-center items-center`}
            >
              {/* display numbers of bets of both players fetch from api  neet to just counts of bets  */}
              <Text style={tw`text-white font-bold text-lg`}>
                {userStatistics.creatorStats.wins} -{' '}
                {userStatistics.opponentStats.wins}
              </Text>
            </LinearGradient>
          </View>
          {/* Opponent */}
          <Pressable
            // onPress={() => handleResolveBet(opponent?.id)}
            onPress={() => setSelectedWinnerId(opponent?.id)}
            style={tw`flex-1 max-w-[40%] items-center`}
          >
            <LinearGradient
              colors={['#FF094E', '#F5444E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`p-[2px] rounded-2xl w-full`}
            >
              <LinearGradient
                colors={
                  selectedWinnerId === opponent?.id
                    ? ['#FF094E', '#F5444E']
                    : ['#FFFFFF', '#FFFFFF']
                }
                style={tw`rounded-2xl items-center justify-center h-30 p-3`}
              >
                <Image
                  source={
                    opponent?.profilePicture
                      ? { uri: opponent.profilePicture }
                      : Images.avatar
                  }
                  resizeMode="cover"
                  style={tw`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200`}
                />
                <Text
                  style={tw`mt-2 font-bold text-sm md:text-base text-center text-black`}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {opponent?.playerName}
                </Text>
              </LinearGradient>
            </LinearGradient>
          </Pressable>
        </View>
        {/* Bet Meta Info */}
        <View style={tw`flex-row justify-between items-center mt-6`}>
          <View>
            <Text style={tw`font-medium mb-6`}>Bet Ended On</Text>
            <View style={tw`flex-row items-center`}>
              <Image source={Images.calendars} style={tw`w-5 h-5`} />
              <Text style={tw`ml-2 font-regular`}>
                {dayjs(expiresAt).format('DD MMM YYYY, hh:mm A')}
              </Text>
            </View>
          </View>
          <View>
            <Text style={tw`font-medium mb-6`}>Decision Method</Text>
            <View style={tw`flex-row items-center`}>
              <Image source={Images.consensus2} style={tw`w-5 h-5`} />
              <Text style={tw`ml-2 font-regular text-red-500`}>
                {resolutionMethod}
              </Text>
            </View>
          </View>
        </View>
        {/* Bet Description */}
        <View style={tw`mt-4`}>
          <Text style={tw`font-medium mb-1`}>Description</Text>
          <Text style={tw`text-sm text-black`}>{description}</Text>
          <Text style={tw`font-medium mt-4 mb-1`}>
            {creator?.playerName} Stake
          </Text>
          <Text style={tw`text-sm text-black`}>
            {requesterStake || 'No stake defined'}
          </Text>
          <Text style={tw`font-medium mt-4 mb-1`}>
            {opponent?.playerName} Stake
          </Text>
          <Text style={tw`text-sm text-black`}>
            {receiverStake || 'No stake defined'}
          </Text>
        </View>
        {/* Visibility */}
        <Text style={tw`font-medium mt-6 mb-4`}>Viewability</Text>
        <GradientText text={visibility} style={tw`font-regular text-base`} />
        {/* Resolve Bet Button */}
        <View style={tw`flex-1 mt-6`}>
          <Button
            title="Submit Your Vote!"
            textStyle={tw`font-semibold text-sm`}
            onPress={() => handleResolveBet(selectedWinnerId)}
            // onPress={() =>
            //   navigation.navigate('Winning', {
            //     bet: bett, // pass current bet details
            //     highlight: true,
            //   })
            // }
          />
        </View>
      </ScrollView>
      <ConfirmModal
        visible={showMsgModal}
        title="Waiting"
        message={`Waiting for ${
          creator?.id === user?.id ? opponent?.playerName : creator?.playerName
        } vote.`}
        confirmText="Ok"
        onConfirm={() => {
          setShowMsgModal(false);
          navigation.goBack(); // 👈 adjust to your main screen route name
        }}
      />
    </SafeAreaView>
  );
};
export default BetsResolve;