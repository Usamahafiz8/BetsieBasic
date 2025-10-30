import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import tw from '../../../lib/tailwind';
import Header from '../../../components/Header';
import { useBetsieStore } from '../../../store/useBetsieStore';
import Images from '../../../constant/Images';
import Button from '../../../components/Button';
import { baseUrl } from '../../../api/baseUrl';
import { CommonActions } from '@react-navigation/native';

const BetReview = ({ route, navigation }) => {
  const {
    receiver,
    description,
    visibility,
    expiresAt,
    resolutionMethod,
    headToHead,
  } = route.params;
  const { user, token } = useBetsieStore();
  //   const payload = {
  //     receiverId: receiver.id,
  //     // title: description,
  //     description: description,
  //     // requesterStake: initiatorStake,
  //     // receiverStake: takerStake,
  //     resolutionMethod: resolutionMethod,
  //     visibility: visibility,
  //     expiresAt: expiresAt.toISOString(),
  //   };

  const handleSendBetRequest = async () => {
    const payload = {
      receiverId: receiver.id,
      description,
      resolutionMethod,
      visibility,
      expiresAt:
        expiresAt instanceof Date
          ? expiresAt.toISOString()
          : new Date(expiresAt).toISOString(),
    };
    console.log('🚀 ~ handleSendBetRequest ~ payload:', payload);

    try {
      const res = await fetch(`${baseUrl}/bets/requestnew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', res.status);

      if (!res.ok) throw new Error(`Failed to send bet request: ${res.status}`);
      const data = await res.json();
      console.log('🚀 ~ handleSendBetRequest ~ data:', data);
      navigation.navigate('MyBets', {
        screen: 'BetDetail',
        params: { bet: data.data, headToHead },
      });

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'DefineBet' }],
        }),
      );
    } catch (err) {
      console.error('Error sending bet request:', err);
      Alert.alert('Error', 'Failed to send bet request');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      <View style={tw`px-6`}>
        <Text style={tw`text-lg font-semibold text-center py-2`}>
          Review Your Bet
        </Text>
        <View style={tw`flex-row justify-around items-center mt-4`}>
          {/* Creator */}
          <View style={tw`flex-1 items-center`}>
            <Image
              source={
                user?.profilePicture
                  ? { uri: user.profilePicture }
                  : Images.avatar
              }
              style={tw`w-20 h-20 rounded-full border-2 border-[#FF094E]`}
            />
            <Text style={tw`mt-2 font-bold text-base text-black text-center`}>
              {user?.playerName}
            </Text>
          </View>

          {/* Score and VS text */}
          <View style={tw`flex-col mx-4`}>
            <View style={tw`justify-center`}>
              <View style={tw`bg-[#FF094E] px-4 py-2 rounded-md`}>
                <Text style={tw`text-white font-bold text-lg`}>
                  {headToHead
                    ? `${headToHead.userWins} - ${headToHead.opponentWins}`
                    : '—'}
                </Text>
              </View>
            </View>

            <Text style={tw`text-[#FF094E] font-bold text-lg mt-2 text-center`}>
              vs
            </Text>
          </View>

          {/* Opponent */}
          <View style={tw`flex-1 items-center`}>
            <View style={tw`relative`}>
              <Image
                source={
                  receiver?.profilePicture
                    ? { uri: receiver?.profilePicture }
                    : Images.avatar
                }
                style={tw`w-20 h-20 rounded-full border-2 border-[#FF094E]`}
              />
            </View>
            <Text style={tw`mt-2 font-bold text-base text-black text-center`}>
              {receiver?.playerName}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={tw`mt-5`}>
          <Text style={tw`mb-2 font-medium text-[black]`}>I bet...</Text>

          <Text style={tw`text-black font-regular text-sm`}>{description}</Text>
        </View>

        {/* Inbox + Decision */}
        <View style={tw`flex-row justify-between mt-4`}>
          {/* End Date */}
          <View style={tw`flex-1 gap-3 items-start `}>
            <Text style={tw`font-medium text-base`}>Bet Ends on</Text>
            <View style={tw`flex-row items-center mt-2`}>
              <Image source={Images.calendars} style={tw`w-6 h-6`} />
              <Text style={tw`ml-1 font-regular text-xs `}>
                {expiresAt &&
                  new Date(expiresAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) +
                    ' | ' +
                    new Date(expiresAt).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
              </Text>
            </View>
          </View>

          {/* Decision Method */}
          <View style={tw`flex-1 gap-3 items-end`}>
            <Text style={tw`font-medium text-base`}>Decision Method</Text>
            <View style={tw`flex-row items-center mt-2`}>
              <Image source={Images.consensus2} style={tw`w-6 h-6`} />
              <Text style={tw`ml-2 font-regular text-sm `}>
                {resolutionMethod}
              </Text>
            </View>
          </View>
        </View>

        {/*Visibility */}
        <View style={tw`mt-4`}>
          <Text style={tw`mb-2 font-medium text-black`}>Who Can See This?</Text>
          <Text style={tw`font-regular text-sm`}>
            {visibility === 'private'
              ? 'Just Us (Private)'
              : visibility === 'friends-only'
              ? 'Just Friends'
              : 'Everyone and your mom (public)'}
          </Text>
        </View>

        <View style={tw`my-5`}>
          <Button
            title="Bet!"
            onPress={handleSendBetRequest}
            containerStyle={tw`self-center w-auto`}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BetReview;
