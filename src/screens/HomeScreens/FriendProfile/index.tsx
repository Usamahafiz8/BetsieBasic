import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';

import tw from '../../../lib/tailwind';
import Header from '../../../components/Header';
import Images from '../../../constant/Images';
import Button from '../../../components/Button';
import GradientBorder from '../../../components/GradientBorder';
import GradientText from '../../../components/GradientText';
import { baseUrl } from '../../../api/baseUrl';
import { useBetsieStore } from '../../../store/useBetsieStore';
import Separator from '../../../components/Separator';

const FriendProfile = ({ route }) => {
  const navigation = useNavigation();
  const { token, user: currentUser } = useBetsieStore(state => state);
  console.log('🚀 ~ FriendProfile ~ currentUser:', currentUser);
  const { user } = route.params;
  console.log('🚀 ~ FriendProfile ~ friendUser:', user);

  const [history, setHistory] = useState();
  const [tab, setTab] = useState<'records' | 'feed' | 'between'>('records');
  const [friendStatus, setFriendStatus] = useState<
    'friend' | 'not_friend' | 'request_sent' | 'request_received' | null
  >(null);
  console.log('🚀 ~ FriendProfile ~ friendStatus:', friendStatus);

  const fetchFriendshipStatus = async (otherUserId: number) => {
    try {
      const response = await fetch(
        `${baseUrl}/Friendship/getUserWithStatus/${currentUser?.id}/${otherUserId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          // body: JSON.stringify({ otherUserId }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch friendship status: ${errorText}`);
      }

      const data = await response.json();
      // console.log('✅ Friendship status:', data);
      setFriendStatus(data?.friendshipStatus);
    } catch (error) {
      console.error('❌ Error fetching friendship status:', error);
      setFriendStatus(null);
    }
  };

  const fetchHistoryBetweenUsers = async (otherUserId: number) => {
    try {
      const response = await fetch(`${baseUrl}/bets/history-between-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otherUserId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch history: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Bet history between users:', data);
      return data.data;
    } catch (error) {
      console.error('❌ Error fetching history:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchFriendshipStatus(user?.id);
        const data = await fetchHistoryBetweenUsers(user?.id);
        setHistory(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [user]);

  const renderRecord = () => (
    <LinearGradient
      colors={['#F5444E', '#F63E4E00']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={tw`rounded-xl p-[1px] mx-3 my-3`}
    >
      <ScrollView
        style={tw`bg-white p-4 rounded-xl`}
        showsVerticalScrollIndicator={false}
      >
        <Text style={tw`font-semibold text-base mb-2`}>
          Overall Bet History
        </Text>
        <View style={tw`flex-row justify-between py-2`}>
          <Text style={tw`font-regular text-base`}>Bets Won</Text>
          <GradientText
            text={history?.otherUserStats?.wonBets ?? 0}
            style={tw`text-base font-regular`}
          />
        </View>
        <View style={tw`my-1`}>
          <GradientBorder />
        </View>
        <View style={tw`flex-row justify-between py-2`}>
          <Text style={tw`font-regular text-base`}>Bets Loss</Text>

          <GradientText
            text={history?.otherUserStats?.lostBets ?? 0}
            style={tw`text-base font-regular`}
          />
        </View>

        {friendStatus === 'friend' && (
          <>
            <Text style={tw`font-semibold text-base mb-2 mt-4`}>
              Bet History Between Us
            </Text>

            <View style={tw`flex-row justify-between py-2`}>
              <Text style={tw`font-regular text-base`}>Bets Won</Text>
              <GradientText
                text={history?.betweenUsersStats?.otherUserWonAgainst}
                style={tw`text-base font-regular`}
              />
            </View>
            <View style={tw`my-1`}>
              <GradientBorder />
            </View>
            <View style={tw`flex-row justify-between py-2`}>
              <Text style={tw`font-regular text-base`}>Bets Loss</Text>

              <GradientText
                text={history?.betweenUsersStats?.otherUserLostAgainst}
                style={tw`text-base font-regular`}
              />
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );

  const renderBetweenUs = ({ item }: any) => {
    // const isMe =
    return (
      <>
        <View style={tw`py-2`}>
          <View style={tw`flex-row justify-between`}>
            <Image
              source={
                user?.profilePicture
                  ? { uri: user?.profilePicture }
                  : Images.avatar
              }
              style={tw`w-14 h-14 rounded-full border-2 border-red-500`}
            />
            <View style={tw`flex-1 pl-2`}>
              <Text style={tw`font-bold text-lg`}>{user?.playerName}</Text>
              <Text style={tw`font-regular text-base`}>
                {item?.description}
              </Text>
            </View>
          </View>
          <View style={tw`flex-row justify-evenly items-center mt-2`}>
            {/* End Date */}

            <View style={tw`flex-row items-center`}>
              <Image source={Images.calendars} style={tw`w-5 h-5`} />
              <Text style={tw`ml-2 font-regular`}>
                {dayjs(item?.expiresAt).format('DD MMM YYYY, hh:mm A')}
              </Text>
            </View>

            {/* Decision Method */}

            <View style={tw`flex-row items-center`}>
              <Image source={Images.consensus2} style={tw`w-5 h-5`} />
              <Text style={tw`ml-2 font-regular text-red-500`}>
                {item?.resolutionMethod}
              </Text>
            </View>
          </View>
        </View>
        <Separator />
      </>
    );
  };

  const renderFeed = () => (
    <LinearGradient
      colors={['#F5444E', '#F63E4E00']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={tw`rounded-xl p-[1px] mx-3 my-3`}
    >
      <View
        style={tw`bg-white p-4 rounded-xl items-center justify-center py-10`}
      >
        <Text style={tw`text-center`}>Coming Soon...</Text>
      </View>
    </LinearGradient>
  );

  const handleAddFriend = async () => {
    try {
      const res = await fetch(`${baseUrl}/friendship/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requesterId: currentUser?.id, // logged-in user's ID
          receiverId: user?.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send friend request');
      }

      setFriendStatus('request_sent');
    } catch (err) {
      console.error('❌ Error sending friend request:', err);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      {/* Profile */}
      <View style={tw`items-center mt-2`}>
        <Image
          source={
            user?.profilePicture ? { uri: user?.profilePicture } : Images.avatar
          }
          style={tw`w-24 h-24 rounded-full border-2 border-red-500`}
        />
        <Text style={tw`font-bold text-lg mt-2`}>{user?.playerName}</Text>
        <Text style={tw`font-medium text-[#989898] text-sm`}>
          @{user?.email?.split('@')[0]} • {user?.totalFriends} friends
        </Text>
      </View>

      {friendStatus === 'friend' ? (
        <Button
          title="Create Bet"
          containerStyle={tw`mx-6 my-4`}
          onPress={() => navigation.navigate('DefineBet')}
        />
      ) : friendStatus === 'not_friend' ? (
        <Button
          title="Add Friend"
          containerStyle={tw`mx-6 my-4`}
          onPress={handleAddFriend}
        />
      ) : friendStatus === 'request_sent' ? (
        <Button title="Request Sent" containerStyle={tw`mx-6 my-4`} disabled />
      ) : (
        <Button
          title="Request Received"
          containerStyle={tw`mx-6 my-4`}
          disabled
        />
      )}

      {/* Tabs */}
      <View style={tw`flex-row justify-around items-center mt-4`}>
        <TouchableOpacity onPress={() => setTab('records')}>
          {tab === 'records' ? (
            <GradientBorder style={tw`px-2 py-1`} borderRadius={16}>
              <Text style={tw`font-base text-[#FF094E] text-sm`}>
                Bet Records
              </Text>
            </GradientBorder>
          ) : (
            <Text style={tw`font-base text-sm`}>Bet Records</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('feed')}>
          {tab === 'feed' ? (
            <GradientBorder style={tw`px-2 py-1`} borderRadius={16}>
              <Text style={tw`font-base text-[#FF094E] text-sm`}>Feed</Text>
            </GradientBorder>
          ) : (
            <Text style={tw`font-base text-sm`}>Feed</Text>
          )}
        </TouchableOpacity>
        {friendStatus === 'friend' && (
          <TouchableOpacity onPress={() => setTab('between')}>
            {tab === 'between' ? (
              <GradientBorder style={tw`px-2 py-1`} borderRadius={16}>
                <Text style={tw`font-base text-[#FF094E] text-sm`}>
                  Between Us
                </Text>
              </GradientBorder>
            ) : (
              <Text style={tw`font-base text-sm`}>Between Us</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Content */}
      <View style={tw`flex-1`}>
        {tab === 'records' && renderRecord()}
        {tab === 'feed' && renderFeed()}
        {tab === 'between' && (
          <LinearGradient
            colors={['#F5444E', '#F63E4E00']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={tw`rounded-xl p-[1px] mx-3 my-3`}
          >
            <View style={tw`bg-white p-2 rounded-xl`}>
              <FlatList
                data={history?.betsBetweenUsers}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={renderBetweenUs}
                ListEmptyComponent={() => (
                  <View style={tw`items-center justify-center py-10`}>
                    <Text style={tw`text-gray-500 text-base`}>
                      No bets found between users
                    </Text>
                  </View>
                )}
              />
            </View>
          </LinearGradient>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FriendProfile;
