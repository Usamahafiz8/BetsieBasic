import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';

import tw from '../../../lib/tailwind';
import Images from '../../../constant/Images';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import Search from '../../../components/Search';
import FriendListItem from '../../../components/FriendListItem';
import GradientBorder from '../../../components/GradientBorder';
import { useBetsieStore } from '../../../store/useBetsieStore';
import { baseUrl } from '../../../api/baseUrl';
import GradientText from '../../../components/GradientText';
import ViewabilityBottomSheet from '../../../components/BetVisibility';

const DefineBet = () => {
  const navigation = useNavigation();
  const { user, token } = useBetsieStore();
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [endDate, setEndDate] = useState(dayjs().add(24, 'hour').toDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<
    'private' | 'friends-only' | 'public'
  >('private');
  const [isSheetVisible, setSheetVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [headToHead, setHeadToHead] = useState<{
    userWins: number;
    opponentWins: number;
  } | null>(null);
  const isNextDisabled = participants.length === 0 || description.trim() === '';

  // 🔹 Fetch Friends
  const fetchFriends = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/friendship/friends/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Failed to fetch friends: ${res.status}`);
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error('Error fetching friends:', err);
      Alert.alert('Error', 'Failed to load friends list');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFriends();
    }, []),
  );

  useEffect(() => {
    if (search.length > 0) {
      setSearchResults(
        friends.filter(f =>
          f?.playerName?.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    } else {
      setSearchResults([]);
    }
  }, [search, friends]);

  const handleAddParticipant = async (friend: any) => {
    setParticipants(prev => [...prev, friend]);
    setSearchResults(prev => prev.filter(u => u.id !== friend.id));
    setSearch('');
    setIsSearchFocused(false);

    try {
      const res = await fetch(`${baseUrl}/bets/stats-between-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otherUserId: friend.id }),
      });

      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      console.log('🚀 ~ handleAddParticipant ~ data:', data);

      // assuming API returns { userWins: number, opponentWins: number }
      setHeadToHead({
        userWins: data?.creatorStats?.wins,
        opponentWins: data?.opponentStats?.wins,
      });
    } catch (err) {
      console.error('Error fetching head-to-head stats:', err);
      setHeadToHead(null);
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

    // check minimum time = 2 minutes ahead
    const minAllowed = new Date(now.getTime() + 3 * 60 * 1000); // 2 minutes later

    if (merged < minAllowed) {
      Alert.alert(
        'Invalid End Time',
        'Bet must end at least 2 minutes from now.'
      );
      setEndDate(minAllowed); // optional: auto-fix to min allowed
    } else {
      setEndDate(merged);
    }
  }

  setShowTimePicker(false);
};


  const handleNext = () => {
    navigation.navigate('ChooseDecisionMethod', {
      receiver: participants[0],
      description,
      visibility,
      expiresAt: endDate.toISOString(),
      headToHead,
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      <FlatList
        data={
          isSearchFocused && search.length === 0
            ? friends
            : searchResults.length > 0
            ? searchResults
            : []
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        keyboardShouldPersistTaps="handled"
        style={tw`px-6`}
        renderItem={({ item }) => (
          <FriendListItem
            user={item}
            variant="bet"
            onAddToBet={handleAddParticipant}
          />
        )}
        ListHeaderComponent={
          <>
            <Text style={tw`text-lg font-semibold text-center py-2`}>
              Start Your Bet
            </Text>

            {/* Countdown Timer
            {endDate && (
              <View style={tw`items-center my-2`}>
                <Text style={tw`text-red-500 text-lg font-semibold`}>
                  Time Left: {countdown}
                </Text>
              </View>
            )} */}

            {/* Add Participant */}
            <View style={tw`mt-2 `}>
              <Text style={tw`mb-2 font-medium text-black text-base`}>
                Select Friend
              </Text>
              <Search
                query={search}
                setQuery={setSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </View>

            {/* Loading */}
            {loading && (
              <ActivityIndicator
                style={tw`mt-4`}
                size="large"
                color="#F6444E"
              />
            )}
          </>
        }
        ListFooterComponent={
          <>
            {/* Selected Participants */}
            {participants.length > 0 && (
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
                  <Text
                    style={tw`mt-2 font-bold text-base text-black text-center`}
                  >
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
                        participants[0]?.profilePicture
                          ? { uri: participants[0]?.profilePicture }
                          : Images.avatar
                      }
                      style={tw`w-20 h-20 rounded-full border-2 border-[#FF094E]`}
                    />
                    <TouchableOpacity
                      onPress={() => setParticipants([])} // or remove specific participant if multiple
                      style={tw`absolute -top-1 -right-1 bg-[#FF094E] w-6 h-6 rounded-full items-center justify-center`}
                    >
                      <Text style={tw`text-white text-sm font-bold`}>×</Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={tw`mt-2 font-bold text-base text-black text-center`}
                  >
                    {participants[0]?.playerName}
                  </Text>
                </View>
              </View>
            )}

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

            {/* Description */}
            <View style={tw`mt-5`}>
              <Text style={tw`mb-2 font-medium text-[black]`}>I bet...</Text>
              <GradientBorder>
                <TextInput
                  placeholder="Start typing to add bet details here"
                  placeholderTextColor="#989898"
                  value={description}
                  onChangeText={setDescription}
                  style={tw`text-black font-regular text-sm h-[25]`}
                  textAlignVertical="top"
                  multiline
                />
              </GradientBorder>
            </View>

            {/* End Date */}
            <View style={tw`mt-5`}>
              <Text style={tw`font-medium text-base`}>Bet Ends on</Text>
              <TouchableOpacity
                style={tw`flex-row items-center mt-2`}
                onPress={() => setShowDatePicker(true)}
              >
                <Image source={Images.calendars} style={tw`w-6 h-6`} />
                <GradientText
                  text={`${endDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}|${endDate.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}`}
                  style={tw`ml-2 font-regular text-sm underline`}
                />
              </TouchableOpacity>
            </View>

            <View style={tw`mt-5`}>
              <Text style={tw`mb-2 font-medium text-black`}>
                Who Can See This?
              </Text>

              <TouchableOpacity onPress={() => setSheetVisible(true)}>
                <Text style={tw`text-[#FF094E] underline`}>
                  {visibility === 'private'
                    ? 'Just Us (Private)'
                    : visibility === 'friends-only'
                    ? 'Just Friends'
                    : 'Everyone and your mom (public)'}
                </Text>
              </TouchableOpacity>

              <ViewabilityBottomSheet
                visible={isSheetVisible}
                onClose={() => setSheetVisible(false)}
                value={visibility}
                onChange={setVisibility}
              />
            </View>

            <View style={tw`my-5`}>
              <Button
                title="Next >"
                onPress={handleNext}
                containerStyle={tw`self-center w-auto`}
                disabled={isNextDisabled}
              />
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default DefineBet;
