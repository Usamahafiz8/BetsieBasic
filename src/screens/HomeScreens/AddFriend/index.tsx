import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  Text,
  View,
} from 'react-native';
import Contacts from 'react-native-contacts';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import FriendListItem from '../../../components/FriendListItem';
import Header from '../../../components/Header';
import Search from '../../../components/Search';
import tw from '../../../lib/tailwind';
import Button from '../../../components/Button';
import { useBetsieStore } from '../../../store/useBetsieStore';
import { baseUrl } from '../../../api/baseUrl';

type BottomTabParamList = {
  Home: undefined;
  MyBets: undefined;
  AddFriend: undefined;
  CreateBet: undefined;
  Notification: undefined;
  profile: undefined;
};

type NavigationProp = BottomTabNavigationProp<BottomTabParamList, 'AddFriend'>;

const AddFriend: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, token } = useBetsieStore();
  const [contacts, setContacts] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState([]); // store original list

  useEffect(() => {
    fetchUsersWithStatus();
  }, []);

  const fetchUsersWithStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/friendship/all/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log('🚀 ~ fetchUsersWithStatus ~ data:', data);
      setResults(data); // assume API returns array of { id, name, status }
      setOriginalData(data);
    } catch (error) {
      console.log('❌ Failed to load users:', error);
      Alert.alert('Error', 'Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };

  // const loadContacts = async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
  //         {
  //           title: 'Contacts Permission',
  //           message:
  //             'This app needs access to your contacts to import friends.',
  //           buttonPositive: 'OK',
  //         },
  //       );

  //       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //         Alert.alert(
  //           'Permission denied',
  //           'Cannot access contacts without permission.',
  //         );
  //         return;
  //       }
  //     }

  //     const allContacts = await Contacts.getAll();
  //     console.log('🚀 ~ loadContacts ~ allContacts:', allContacts);
  //     setContacts(allContacts);
  //   } catch (error) {
  //     console.error('❌ Error loading contacts:', error);
  //   }
  // };

  const handleSearch = async (text: string) => {
    if (!text.trim()) {
      setResults(originalData);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/users/search?playerName=${encodeURIComponent(text.trim())}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // if search requires auth
          },
        },
      );

      if (!res.ok) {
        throw new Error('Failed to search users');
      }

      const data = await res.json();
      console.log(':rocket: ~ handleSearch ~ data:', data);
      setResults(data);
    } catch (err) {
      console.error('❌ Error searching users:', err);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };
  const handleAddFriend = async (receiverId: number) => {
    try {
      const res = await fetch(`${baseUrl}/friendship/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requesterId: user?.id, // logged-in user's ID
          receiverId,
        }),
      });
      const data = res.json();
      console.log('🚀 ~ handleAddFriend ~ data:', data);
      if (!res.ok) {
        throw new Error('Failed to send friend request');
      }

      // ✅ Update UI
      setResults(prev =>
        prev.map(friend =>
          friend.id === receiverId
            ? { ...friend, friendshipStatus: 'request_sent' }
            : friend,
        ),
      );

      // ✅ Trigger front-end friend request notification
      const notificationPayload = {
        id: Date.now(),
        logo:
          user?.profilePicture ||
          'https://cdn-icons-png.flaticon.com/512/847/847969.png',
        senderName: user?.playerName || 'Unknown User',
        message: 'sent you a friend request!',
        timestamp: new Date().toISOString(),
      };

      // showInAppNotification(notificationPayload);
      // ✅ Play notification sound
      // playNotificationSoundAndNotify('friend');
    } catch (err) {
      console.error('❌ Error sending friend request:', err);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Custom Header */}
      <Header
        title="Create New"
        onPress={() =>
          navigation.navigate('CreateBet', {
            screen: 'DefineBet',
          })
        }
      />

      <View style={tw`flex-row px-4 py-1 items-center`}>
        <Text style={tw`font-medium text-black text-lg`}>Add Friend</Text>
      </View>
      {/* Search Bar */}
      <View style={tw`mx-4`}>
        <Search query={query} setQuery={setQuery} onSearch={handleSearch} />
      </View>
      {/* Results */}
      <LinearGradient
        colors={['#F5444E', 'rgba(246, 62, 78, 0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={tw`rounded-lg p-[2px] mx-3 my-3`}
      >
        <View style={tw`bg-white rounded-lg px-3`}>
          <FlatList
            data={results}
            keyExtractor={item => item?.id.toString()}
            renderItem={({ item }) => (
              <FriendListItem
                user={item}
                variant="main"
                onAddFriend={handleAddFriend}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !loading ? (
                <Text style={tw`text-center mt-10 text-gray-500 font-regular`}>
                  No users found.
                </Text>
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 150 }}
            refreshing={loading}
            onRefresh={fetchUsersWithStatus}
          />
        </View>
      </LinearGradient>

      {/* Import from Contacts (show only if no contacts loaded) */}
      {/* {contacts.length === 0 && (
        <View style={tw`flex-1 justify-center items-center gap-3 mx-4`}>
          <Text style={tw`font-semibold text-lg`}>Import from Contacts</Text>
          <Text style={tw`font-regular text-xs text-center`}>
            Quickly bring in your saved contacts to get started without adding
            them manually.
          </Text>
          <Button
            title="Import"
            containerStyle={tw`px-8`}
            textStyle={tw`font-semibold text-base`}
            onPress={loadContacts}
          />
        </View>
      )} */}

      {/* Contacts List (show only if contacts exist) */}
      {/* {contacts.length > 0 && (
        <View style={tw`mx-4`}>
          <Text style={tw`font-medium text-base`}>My Contacts</Text>
          <LinearGradient
            colors={['#F5444E', 'rgba(246, 62, 78, 0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={tw`rounded-lg p-[2px] my-3`} // p-[3px] = border thickness
          >
            <View style={tw`bg-white rounded-lg px-3`}>
              <FlatList
                data={contacts}
                keyExtractor={item => item.recordID}
                renderItem={({ item }) => (
                  <FriendListItem
                    user={item}
                    variant="main"
                    onAddFriend={handleAddFriend}
                  />
                )}
                ListEmptyComponent={
                  !loading ? (
                    <Text
                      style={tw`text-center mt-10 text-gray-500 font-regular`}
                    >
                      No users found.
                    </Text>
                  ) : null
                }
              />
            </View>
          </LinearGradient>
        </View>
      )} */}
    </SafeAreaView>
  );
};

export default AddFriend;
