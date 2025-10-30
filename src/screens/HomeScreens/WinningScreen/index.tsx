import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../../../lib/tailwind';
import Header from '../../../components/Header';
import Images from '../../../constant/Images';
import Button from '../../../components/Button';
import { baseUrl } from '../../../api/baseUrl';
import { useBetsieStore } from '../../../store/useBetsieStore';
import dayjs from 'dayjs';
import GradientText from '../../../components/GradientText';

// Dummy comments
const commentsData = [
  {
    id: '1',
    name: 'Real Name',
    time: '2 Hours Ago',
    comment: 'Comments which user have added here.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
];

interface Comment {
  id: string;
  name: string;
  time: string;
  comment: string;
  avatar: string;
}

const WinningScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { bet } = route.params as { bet: any };
  console.log('🚀 ~ WinningScreen ~ bet :', bet);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Comment[]>(commentsData);
  const { user, token } = useBetsieStore();

  const {
    id,
    creator,
    opponent,
    description,
    stakeDescription,
    resolutionMethod,
    expiresAt,
    winner,
    visibility,
    requesterStake,
    receiverStake,
    status,
  } = bet;

  const flatListRef = useRef<FlatList>(null);

  // 🛰️ Send Message API + Debug Logs
  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      id: `${Date.now()}`,
      name: user?.playerName,
      time: 'Just now',
      comment: input,
      avatar: user?.profilePicture || '',
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const res = await fetch(`${baseUrl}/chat/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          betId: id,
          receiverId: creator?.id === user?.id ? opponent?.id : creator?.id,
          message: input,
        }),
      });

      console.log('✅ API call completed!');
      console.log('📩 Winner:', winner);
      console.log('📩 Loser:', loser);
      console.log('🌐 API Status:', res.status);

      const text = await res.text();
      console.log('🧾 API Response Text:', text);

      if (!res.ok) {
        console.error('❌ Failed to send message');
      } else {
        console.log('✅ Message sent successfully!');
      }
    } catch (err) {
      console.error('🚨 Error sending message:', err);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={tw`flex-row items-start py-3 border-b border-gray-200`}>
      <Image
        source={item.avatar ? { uri: item.avatar } : Images.player}
        style={tw`w-10 h-10 rounded-full border-2 border-gradientColor100 mr-3`}
      />
      <View style={tw`flex-1`}>
        <Text style={tw`font-bold text-base`}>{item.name}</Text>
        <Text style={tw`text-xs text-gray-500 mb-1`}>{item.time}</Text>
        <Text style={tw`text-sm text-gray-700 mb-2`}>{item.comment}</Text>
        <View style={tw`flex-row`}>
          <TouchableOpacity>
            <Text style={tw`text-gradientColor100 text-sm mr-4`}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={tw`text-gradientColor100 text-sm`}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  const winnerr = winner?.id === user?.id;
  const isDraw = status === 'withdraw' || status === 'cancelled';
  console.log("🚀 ~ WinningScreen ~ isDraw:", isDraw)
  const otherParticipant = user?.id === creator?.id ? opponent : creator;
  const otherLabel = winnerr ? 'Loser' : 'Winner';
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />

      <FlatList
        ref={flatListRef}
        ListHeaderComponent={
          <>
            {isDraw ? (
              <>
                <GradientText
                  text="Bet Disputed"
                  style={tw`font-bold text-lg text-center`}
                />
                <View style={tw`flex-row justify-around items-center mt-4`}>
                  {/* Creator */}
                  <View style={tw`flex-1 items-center`}>
                    <Image
                      source={
                        creator?.profilePicture
                          ? { uri: creator?.profilePicture }
                          : Images.avatar
                      }
                      style={tw`w-20 h-20 rounded-full border-2 border-[#FF094E]`}
                    />
                    <Text
                      style={tw`mt-2 font-bold text-base text-black text-center`}
                    >
                      {creator?.playerName}
                    </Text>
                  </View>

                  {/* Score and VS text */}
                  <View style={tw`flex-col mx-4`}>
                    {/* <View style={tw`justify-center`}>
                      <View style={tw`bg-[#FF094E] px-4 py-2 rounded-md`}>
                        <Text style={tw`text-white font-bold text-lg`}>
                          {user?.totalGamesWon} - {receiver?.totalGamesWon}
                        </Text>
                      </View>
                    </View> */}

                    <Text
                      style={tw`text-[#FF094E] font-bold text-lg mt-2 text-center`}
                    >
                      vs
                    </Text>
                  </View>

                  {/* Opponent */}
                  <View style={tw`flex-1 items-center`}>
                    <View style={tw`relative`}>
                      <Image
                        source={
                          opponent?.profilePicture
                            ? { uri: opponent?.profilePicture }
                            : Images.avatar
                        }
                        style={tw`w-20 h-20 rounded-full border-2 border-[#FF094E]`}
                      />
                    </View>
                    <Text
                      style={tw`mt-2 font-bold text-base text-black text-center`}
                    >
                      {opponent?.playerName}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Winner Info */}
                <View style={tw`items-center mt-6`}>
                  <Image
                    source={
                      user?.profilePicture
                        ? { uri: user?.profilePicture }
                        : Images.avatar
                    }
                    style={tw`w-28 h-28 rounded-full border-2 border-gradientColor100`}
                  />
                  <Text
                    style={tw`text-xl text-gradientColor100 mt-4 font-shadowText`}
                  >
                    {winnerr
                      ? 'Congratulations You Won!'
                      : 'Better Luck Next Time'}
                  </Text>
                </View>

                {/* Other Participant */}
                <View style={tw`px-2 mt-6`}>
                  <Text style={tw`font-bold text-base mb-3`}>
                    Other participant
                  </Text>
                  <View style={tw`flex-row items-center justify-between`}>
                    <View style={tw`flex-row items-center`}>
                      <Image
                        source={
                          otherParticipant?.profilePicture
                            ? { uri: otherParticipant?.profilePicture }
                            : Images.avatar
                        }
                        style={tw`w-10 h-10 rounded-full border-2 border-gradientColor100 mr-2`}
                      />
                      <View>
                        <Text style={tw`font-bold text-base`}>
                          {otherParticipant?.playerName}
                        </Text>

                        <Text
                          style={tw`${
                            otherLabel === 'Winner'
                              ? 'text-green-600'
                              : otherLabel === 'Loser'
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {otherLabel}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}

            <View style={tw`flex-row justify-between items-center mt-6`}>
              <View style={tw`gap-3`}>
                <Text style={tw`font-medium text-md`}>Bet Ends On</Text>
                <View style={tw`flex-row items-center`}>
                  <Image source={Images.calendars} style={tw`w-5 h-5`} />
                  <Text style={tw`ml-2 font-regular`}>
                    {dayjs(expiresAt).format('MMM DD, YYYY | hh:mm A')}
                  </Text>
                </View>
              </View>
              <View style={tw`gap-3`}>
                <Text style={tw`font-medium text-md`}>Decision Method</Text>
                <View style={tw`flex-row items-center`}>
                  <Image source={Images.consensus2} style={tw`w-5 h-5`} />
                  <Text style={tw`ml-2 font-regular text-red-500`}>
                    {resolutionMethod}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={tw`mt-4 px-2`}>
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

            <View style={tw`mt-4 px-2`}>
              <Text style={tw`mb-2 font-medium text-black`}>
                Who Can See This?
              </Text>
              <Text style={tw`font-regular text-sm`}>
                {visibility === 'private'
                  ? 'Just Us (Private)'
                  : visibility === 'friends-only'
                  ? 'Just Friends'
                  : 'Everyone and your mom (public)'}
              </Text>
            </View>

            <View style={tw`px-4 mt-6`}>
              <Text style={tw`font-bold text-base`}>Comments</Text>
            </View>
          </>
        }
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderComment}
        contentContainerStyle={tw`px-4 pb-20`}
      />

      {/* Comment Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View
          style={tw`flex-row items-center border border-red-500 rounded-full px-3 py-1 mx-4 mb-4 bg-white`}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Message"
            placeholderTextColor="#999"
            style={tw`flex-1 text-base text-black px-2 py-2`}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend}>
            <Image
              source={Images.send}
              style={tw`w-6 h-6`}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WinningScreen;