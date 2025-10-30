import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import tw from '../../../lib/tailwind';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import { useCountdown } from '../../../hooks/useCountdown';
import Images from '../../../constant/Images';
import GradientText from '../../../components/GradientText';
import ConfirmModal from '../../../components/ConfirmModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import CommentSection from '../../../screens/components/CommentSection';
import { useBetsieStore } from '../../../store/useBetsieStore';
import { baseUrl } from '../../../api/baseUrl';
import GradientBorder from '../../../components/GradientBorder';
import BetStakes from '../../../components/BetStakes';

type BetStatus = 'active' | 'pending' | 'completed' | 'Disputed';

interface BetDetailProps {
  bet: {
    status: BetStatus;
    expiresAt?: string;
    createdAt?: string;
    openComments?: boolean;
  };
}

const BetDetailScreen: React.FC<BetDetailProps> = () => {
  const route = useRoute();
  const { postId } = route.params as { postId: string }; // 👈 define type here
  const navigation = useNavigation();
  const { bet } = route.params as { bet: any }; // strongly type later
  const { headToHead } = route.params as { headToHead: any };
  console.log("🚀 ~ BetDetailScreen ~ route.params:", route.params)
  console.log("🚀 ~ BetDetailScreen ~ headToHead:", headToHead)
  console.log('🚀 ~ BetDetailScreen ~ bet:', bet);
  const params = route.params as any;
  const [bett, setBett] = useState(bet);
  const [showDelModal, setShowDelModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { user, token } = useBetsieStore();
  const {
    id,
    status,
    creator,
    opponent,
    description,
    receiverStake,
    requesterStake,
    resolutionMethod,
    visibility,
    expiresAt,
    userStatistics,
  } = bett;
  const [initiatorStake, setInitiatorStake] = useState(requesterStake);
  const [takerStake, setTakerStake] = useState(receiverStake);
  const [stakesModalVisible, setStakesModalVisible] = useState(false);
  const [stakesStatus, setStakesStatus] = useState(bet?.stakesStatus);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [showBetDecModal, setShowBetDecModal] = useState(false);

  // const [showComments, setShowComments] = useState(false);
  const [showComments, setShowComments] = useState<boolean>(
    !!params?.openComments,
  );

  useEffect(() => {
    if (params?.openComments) {
      setShowComments(true);
    }
  }, [params?.openComments]);

  const handleBetDeletion = async () => {
    type Props = {
      params: {
        postId: string;
        // add more if needed
      };
    };

    try {
      const response = await fetch(`${baseUrl}/bets/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete bet');
      }

      const data = await response.json();

      Alert.alert('Success', data.message || 'Bet deleted successfully');

      // Optionally, navigate back after deletion
      navigation.navigate('MyBets');
    } catch (error: any) {
      console.error('Error deleting bet:', error);
      Alert.alert(
        'Error',
        error.message || 'Something went wrong while deleting the bet',
      );
    } finally {
      setShowDelModal(false); // close modal after attempt
    }
  };

  const getAcceptanceDeadline = (createdAt: string, expiresAt: string) => {
    const created = dayjs(createdAt);
    const expires = dayjs(expiresAt);

    const totalDuration = expires.diff(created); // total bet lifespan in ms
    let deadline: dayjs.Dayjs;

    if (totalDuration > 24 * 60 * 60 * 1000) {
      // if bet duration > 24h → taker gets 24h from creation
      deadline = created.add(24, 'hour');
    } else {
      // if bet duration ≤ 24h → taker gets half the total time from creation
      deadline = created.add(totalDuration / 2, 'millisecond');
    }

    return deadline;
  };

  const acceptanceDeadline = getAcceptanceDeadline(
    bett.createdAt,
    bett.expiresAt,
  ).toISOString();
  const acceptanceCountdown = useCountdown(acceptanceDeadline);

  // Header titles based on status
  const titles = {
    active: 'Active Bet',
    pending: 'Pending Bet',
    completed: 'Completed Bet',
  };

  // Buttons based on status
  const actionButtons = {
    active: (
      <View style={tw`mt-6 flex-row justify-between items-center`}>
        <View style={tw`flex-1 mr-2`}>
          <Button
            title="Delete"
            textStyle={tw`font-semibold text-sm`}
            variant="outlined"
            onPress={() => setShowDelModal(true)}
          />
        </View>
        <View style={tw`flex-1`}>
          <Button
            title="See Chat"
            textStyle={tw`font-semibold text-sm`}
            onPress={() => {}}
          />
        </View>
      </View>
    ),
    pending: (
      <View style={tw`mt-6 flex-row justify-between items-center`}>
        <View style={tw`flex-1 mr-2`}>
          <Button
            title="Decline Bet"
            textStyle={tw`font-semibold text-sm`}
            variant="outlined"
            onPress={() => {}}
          />
        </View>
        <View style={tw`flex-1`}>
          <Button
            title="Decide Stakes"
            textStyle={tw`font-semibold text-sm`}
            onPress={() => navigation.navigate('StakeDiscussion')}
          />
        </View>
      </View>
    ),
    completed: (
      <View style={tw`mt-6`}>
        <Button title="See Chat" onPress={() => {}} />
      </View>
    ),
  };

  const handleAcceptBet = async () => {
    try {
      const response = await fetch(`${baseUrl}/bets/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          betId: id,
          receiverId: opponent?.id,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to accept bet');
      }

      const data = await response.json();
      console.log('🚀 ~ handleAcceptBet ~ data:', data);

      Alert.alert('Success', 'Bet accepted!');
      setBett(data.bet);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeclineBet = async () => {
    try {
      const response = await fetch(`${baseUrl}/bets/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          betId: id,
          receiverId: opponent?.id,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to decline bet');
      }

      const data = await response.json();
      console.log('🚀 ~ handleDeclineBet ~ data:', data);

      Alert.alert('Success', 'Bet Declined!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleUpdateBet = async () => {
    if (!takerStake?.trim() || !initiatorStake?.trim()) {
      Alert.alert(
        'Error',
        'Both stakes must be provided before updating the bet.',
      );
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/bets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverStake: takerStake.trim(),
          requesterStake: initiatorStake.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update bet: ${errorText}`);
      }

      const data = await response.json();
      Alert.alert('Success', 'Bet updated successfully!');
      setBett(data.data);
      return data;
    } catch (error) {
      console.error('❌ Error updating bet:', error);
      throw error;
    }
  };

  const handleResendBet = async () => {
    if (!endDate) {
      return Alert.alert('Error', 'Please select a bet ending date.');
    }
    try {
      const response = await fetch(`${baseUrl}/bets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expiresAt: endDate.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update bet: ${errorText}`);
      }

      const data = await response.json();
      Alert.alert('Success', 'Bet resent successfully!');
      setBett(data.data);
      return data;
    } catch (error) {
      console.error('❌ Error updating bet:', error);
      throw error;
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, picked?: Date) => {
    if (event.type === 'set' && picked) {
      setSelectedDate(picked);
      setShowDatePicker(false);
      setShowTimePicker(true); // now open time picker
    } else {
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, picked?: Date) => {
    if (event.type === 'set' && picked && selectedDate) {
      const now = new Date();

      // merge date + picked time
      const merged = new Date(selectedDate);
      merged.setHours(picked.getHours());
      merged.setMinutes(picked.getMinutes());

      // if today, block past times
      const isToday = selectedDate.toDateString() === now.toDateString();

      if (isToday && merged < now) {
        Alert.alert('Invalid Time', 'Please select a time in the future.');
        setEndDate(now); // fallback
      } else {
        setEndDate(merged);
      }
    }
    setShowTimePicker(false);
  };

  const isAcceptanceExpired = acceptanceCountdown === '00:00:00';

  const handleChatPress = () => {
    navigation.navigate('StakeDiscussion', {
      betId: bett?.id,
      friendName:
        bett?.creator?.id === user?.id
          ? bett?.opponent?.playerName
          : bett?.creator?.playerName,
      friendAvatar:
        bett?.creator?.id === user?.id
          ? bett?.opponent?.profilePicture
          : bett?.creator?.profilePicture,
      friendId:
        bett?.creator?.id === user?.id ? bett?.opponent?.id : bett?.creator?.id,
    });
  };

  const handleSetStakes = async ({ requesterStake, receiverStake }) => {
    try {
      const response = await fetch(`${baseUrl}/bets/${id}/stakes/propose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requesterStake,
          receiverStake,
        }),
      });
      console.log('🚀 ~ handleSetStakes ~ response:', response);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to accept bet');
      }

      const data = await response.json();
      setStakesStatus(data?.data?.stakesStatus);
      setStakesModalVisible(false);
    } catch (error) {
      console.error('❌ Error setting stakes:', error);
    }
  };

  const handleAcceptStake = async () => {
    try {
      const response = await fetch(`${baseUrl}/bets/${id}/stakes/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('🚀 ~ handleSetStakes ~ response:', response);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to accept bet');
      }

      const data = await response.json();
      console.log('🚀 ~ handleAcceptStake ~ data:', data);
      setReviewModalVisible(false);
      setBett(data.data);
    } catch (error) {
      console.error('❌ Error setting stakes:', error);
      Alert.alert('error', 'unknown error occured, please try again');
    }
  };

  const initiator = user?.id === creator?.id;

  const handleRejectStake = async () => {
    try {
      const response = await fetch(`${baseUrl}/bets/${id}/stakes/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('🚀 ~ handleSetStakes ~ response:', response);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to accept bet');
      }

      const data = await response.json();
      console.log('🚀 ~ handleRejectStake ~ data:', data);
      setBett(data.data);
      setReviewModalVisible(false);
    } catch (error) {
      console.error('❌ Error setting stakes:', error);
      Alert.alert('error', 'unknown error occured, please try again');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <Header
        showBack
        onPress={() => navigation.goBack()}
        showChat
        onChatPress={handleChatPress}
      />

      {/* <Text style={tw`font-semibold text-xl text-center`}>Bet Details</Text> */}

      {/* Acceptance Time */}
      {status === 'pending' ? (
        <View style={tw`items-center mt-4`}>
          <Text style={tw`font-bold text-lg text-center`}>
            {initiator ? 'Your Bet Is Pending' : 'Wanna Bet?'}
          </Text>

          <View style={tw`flex-row items-center mt-4`}>
            {/* Hours */}
            <View style={tw`bg-[#FF094E] px-4 py-2 rounded-2xl mx-1`}>
              <Text style={tw`text-white text-2xl font-bold`}>
                {acceptanceCountdown.split(':')[0]}
              </Text>
            </View>
            <Text style={tw`text-[#FF094E] text-2xl font-bold`}>:</Text>
            {/* Minutes */}
            <View style={tw`bg-[#FF094E] px-4 py-2 rounded-2xl mx-1`}>
              <Text style={tw`text-white text-2xl font-bold`}>
                {acceptanceCountdown.split(':')[1]}
              </Text>
            </View>
            <Text style={tw`text-[#FF094E] text-2xl font-bold`}>:</Text>
            {/* Seconds */}
            <View style={tw`bg-[#FF094E] px-4 py-2 rounded-2xl mx-1`}>
              <Text style={tw`text-white text-2xl font-bold`}>
                {acceptanceCountdown.split(':')[2]}
              </Text>
            </View>
          </View>

          <Text
            style={tw`mt-2 text-black font-regular text-sm text-center px-4`}
          >
            {initiator
              ? `If ${opponent?.playerName} doesn't accept before the clock runs out, the bet will automatically be cancelled.`
              : 'Time Remaining for you to accept this Bet.'}
          </Text>
        </View>
      ) : (
        <View style={tw`items-center mt-4`}>
          <Text style={tw`font-semibold text-xl text-center`}>
            Your Bet Is Now Live! It's On!
          </Text>
        </View>
      )}

      <ScrollView style={tw`flex-1 px-4`}>
        <View style={tw`flex-row justify-around items-center mt-4`}>
          {/* Creator */}
          <View style={tw`flex-1 items-center`}>
            <Image
              source={
                creator?.profilePicture
                  ? { uri: creator.profilePicture }
                  : Images.avatar
              }
              style={tw`w-20 h-20 rounded-full border-2 border-[#FF094E]`}
            />
            <Text style={tw`mt-2 font-bold text-base text-black text-center`}>
              {creator?.playerName}
            </Text>
          </View>

          {/* Score and VS text */}
          <View style={tw`flex-col mx-4`}>
            <View style={tw`justify-center`}>
              <View style={tw`bg-[#FF094E] px-4 py-2 rounded-md`}>
                <Text style={tw`text-white font-bold text-lg`}>
                  {headToHead
                    ? `${headToHead.userWins} - ${headToHead.opponentWins}`
                    : `${bet?.userStatistics?.creatorStats?.wins} - ${bet?.userStatistics?.opponentStats?.wins}`}
                </Text>
              </View>
            </View>

            <Text style={tw`text-[#FF094E] font-bold text-lg mt-2 text-center`}>
              vs
            </Text>
          </View>

          {/* Opponent */}
          <View style={tw`flex-1 items-center`}>
            <Image
              source={
                opponent?.profilePicture
                  ? { uri: opponent.profilePicture }
                  : Images.avatar
              }
              style={tw`w-20 h-20 rounded-full border-2 border-[#FF094E]`}
            />

            <Text style={tw`mt-2 font-bold text-base text-black text-center`}>
              {opponent?.playerName}
            </Text>
          </View>
        </View>

        {/* Bet Info */}
        <View style={tw`mt-3`}>
          {/* Description */}
          <Text style={tw`font-medium mt-4 mb-1`}>
            {initiator ? 'I Bet...' : `${creator?.playerName} bets...`}
          </Text>
          <Text style={tw`font-regular text-sm`}>{description}</Text>

          {/* Stake Description */}
          {/* <Text style={tw`font-medium mt-4 mb-1`}>
            {creator?.playerName} Stake
          </Text>
          {user?.id === creator?.id ? (
            <GradientBorder>
              <TextInput
                placeholder="Add stake for yourself"
                placeholderTextColor="#989898"
                multiline
                value={initiatorStake}
                onChangeText={setInitiatorStake}
                style={tw`text-black font-regular text-sm`}
              />
            </GradientBorder>
          ) : (
            <Text style={tw`font-regular text-sm`}>
              {requesterStake || 'No stake defined'}
            </Text>
          )} */}

          {/* <Text style={tw`font-medium mt-4 mb-1`}>
            {opponent?.playerName} Stake
          </Text>

          {user?.id === creator?.id ? (
            <GradientBorder>
              <TextInput
                placeholder="Add stake for taker"
                placeholderTextColor="#989898"
                multiline
                value={takerStake}
                onChangeText={setTakerStake}
                style={tw`text-black font-regular text-sm`}
              />
            </GradientBorder>
          ) : (
            <Text style={tw`font-regular text-sm`}>
              {receiverStake || 'No stake defined'}
            </Text>
          )} */}
        </View>

        <View style={tw`flex-row justify-between items-center mt-6`}>
          {/* End Date */}
          <View style={tw`gap-3`}>
            <Text style={tw`font-medium text-md`}>Bet Ends On</Text>
            {isAcceptanceExpired && status === 'pending' ? (
              user?.id === creator?.id ? (
                <TouchableOpacity
                  style={tw`flex-row items-center`}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Image source={Images.calendars} style={tw`w-5 h-5`} />
                  <Text style={tw`ml-2 font-regular text-xs`}>
                    {endDate
                      ? `${endDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}|${endDate.toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}`
                      : '--------------'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={tw`flex-row items-center opacity-60`}>
                  <Image source={Images.calendars} style={tw`w-5 h-5`} />
                  <Text style={tw`ml-2 font-regular text-xs`}>
                    {endDate
                      ? `${endDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })} | ${endDate.toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}`
                      : '--------------'}
                  </Text>
                </View>
              )
            ) : (
              // <View>
              <View style={tw`flex-row items-center`}>
                <Image source={Images.calendars} style={tw`w-5 h-5`} />
                <Text style={tw`ml-2 font-regular`}>
                  {dayjs(expiresAt).format('MMM DD, YYYY | hh:mm A')}
                </Text>
              </View>
              //   <Pressable>
              //     <Text style={tw`font-semibold text-[#FF094E] underline`}>
              //       Add to Calendar
              //     </Text>
              //   </Pressable>
              // </View>
            )}
          </View>
          {/* Decision Method */}
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

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="time"
            display="spinner"
            is24Hour={false}
            onChange={handleTimeChange}
          />
        )}

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

        {status === 'active' && (
          <>
            {requesterStake && receiverStake ? (
              <View style={tw`mt-4`}>
                <Text style={tw`font-medium text-sm text-black mb-3`}>
                  The Stakes
                </Text>
                <Text style={tw`font-medium text-black mb-2`}>
                  If {creator.playerName} wins, then {opponent.playerName}{' '}
                  will...
                </Text>

                <Text style={tw`text-black font-regular text-sm`}>
                  {receiverStake}
                </Text>

                <Text style={tw`font-medium text-black mt-5 mb-2`}>
                  If {opponent.playerName} wins, then {creator.playerName}{' '}
                  will...
                </Text>

                <Text style={tw`text-black font-regular text-sm`}>
                  {requesterStake}
                </Text>
              </View>
            ) : (
              <>
                {user?.id === creator?.id && (
                  <View style={tw`mt-4`}>
                    <Text style={tw`mb-2 font-medium text-black`}>
                      Care to make things interesting?
                    </Text>
                    {stakesStatus === 'awaiting_opponent_response' ? (
                      <Text style={tw`font-semibold text-[#606060]`}>
                        Waiting for {opponent?.playerName} to accept the stakes.
                      </Text>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setStakesModalVisible(true)}
                      >
                        <Text
                          style={tw`font-semibold text-[#FF094E] underline`}
                        >
                          Set the Stakes{' '}
                          <Text
                            style={tw`text-[#606060] font-semibold text-xs`}
                          >
                            (Optional)
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                {/* 🤝 Taker view */}
                {user?.id !== creator?.id && bett?.pendingReceiverStake && (
                  <View style={tw`mt-4`}>
                    <Text style={tw`mb-2 font-medium text-black`}>
                      Care to make things interesting?
                    </Text>
                    <TouchableOpacity
                      onPress={() => setReviewModalVisible(true)}
                    >
                      <Text style={tw`font-semibold text-[#FF094E] underline`}>
                        Review Stakes
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            {user?.id === creator?.id && (
              <Pressable style={tw`my-4`} onPress={handleBetDeletion}>
                <GradientText
                  style={tw`font-semibold text-xs text-center underline`}
                  text="Cancel Bet"
                />
              </Pressable>
            )}
          </>
        )}
        <BetStakes
          visible={stakesModalVisible}
          onClose={() => setStakesModalVisible(false)}
          onSubmit={handleSetStakes}
          userName={creator?.playerName}
          friendName={opponent?.playerName}
          mode="propose"
        />
        <BetStakes
          visible={reviewModalVisible}
          onClose={() => setReviewModalVisible(false)}
          userName={creator?.playerName}
          friendName={opponent?.playerName}
          mode="review"
          pendingReceiverStakes={bet?.pendingReceiverStake}
          pendingRequesterStakes={bet?.pendingRequesterStake}
          onAccept={handleAcceptStake}
          onReject={handleRejectStake}
        />

        {status === 'pending' && creator?.id === user?.id && (
          <>
            <View style={tw`mt-4 flex-row justify-between items-center`}>
              {isAcceptanceExpired && (
                <Button
                  title="Resend Bet"
                  textStyle={tw`font-semibold text-sm`}
                  style={tw`flex-1 mr-2`}
                  onPress={handleResendBet}
                />
              )}

              {/* //   <Button
              //     title="Update Bet"
              //     textStyle={tw`font-semibold text-sm`}
              //     style={tw`flex-1 mr-2`}
              //     onPress={handleUpdateBet}
              //   />
              // )} */}
            </View>
            <Pressable style={tw`my-2`} onPress={handleBetDeletion}>
              <GradientText
                style={tw`font-semibold text-xs text-center underline`}
                text="Cancel Bet"
              />
            </Pressable>
          </>
        )}

        {status === 'pending' && creator?.id !== user?.id && (
          <>
            <View
              style={tw`mt-6 flex-1 flex-row justify-between items-center gap-3`}
            >
              <Button
                title="No"
                textStyle={tw`font-semibold text-sm`}
                style={tw`flex-1`}
                onPress={() => setShowBetDecModal(true)}
                disabled={isAcceptanceExpired}
                variant="outlined"
              />

              <Button
                title="Yes"
                textStyle={tw`font-semibold text-sm`}
                style={tw`flex-1`}
                onPress={handleAcceptBet}
                disabled={isAcceptanceExpired}
              />
            </View>
          </>
        )}

        <ConfirmModal
          visible={showBetDecModal}
          title="Decline Bet"
          message="Are you sure you want to decline this bet?"
          confirmText="Yes"
          cancelText="No"
          onConfirm={handleDeclineBet}
          onCancel={() => setShowBetDecModal(false)}
        />

        {/* {status === 'active' && (
          <View style={tw`mt-6 flex-row justify-between items-center`}>
            <View style={tw`flex-1 mr-2`}>
              <Button
                title="Private Chat"
                textStyle={tw`font-semibold text-sm`}
                variant="outlined"
                onPress={() => {}}
              />
            </View>
            <View style={tw`flex-1`}>
              <View style={tw`flex-1`}>
                <Button
                  title="Public Comments"
                  textStyle={tw`font-semibold text-sm`}
                  onPress={() => setShowComments(prev => !prev)}
                />
              </View>
            </View>
          </View>
        )} */}

        <ConfirmModal
          visible={showDelModal}
          title="Delete Bet"
          message="Are you sure you want to delete this bet?"
          confirmText="Yes"
          cancelText="No"
          onConfirm={handleBetDeletion}
          onCancel={() => setShowDelModal(false)}
        />
        {/* Drop-in comments section */}
      </ScrollView>
      {/* <CommentSection /> */}
      <CommentSection
        betId={bett.id}
        userId={user?.id} // 👈 add this line
        open={showComments}
        style={tw`mt-2 left-0 right-0 bottom-0`}
        onClose={() => setShowComments(false)}
      />
    </SafeAreaView>
  );
};

export default BetDetailScreen;
