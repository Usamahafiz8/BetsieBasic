import { Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import tw from '../../../lib/tailwind';
import Header from '../../../components/Header';
import FriendListItem from '../../../components/FriendListItem';
import { useBetsieStore } from '../../../store/useBetsieStore';
import { baseUrl } from '../../../api/baseUrl';
import ConfirmModal from '../../../components/ConfirmModal';

const FriendList = () => {
  const navigation = useNavigation();
  const { token, user } = useBetsieStore();
  const [friends, setFriends] = useState([]);
  console.log("🚀 ~ FriendList ~ friends:", friends)
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);

  const fetchFriends = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/friendship/friends/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch friends: ${res.status}`);

      const data = await res.json();
      console.log('🚀 ~ fetchFriends ~ data :', data);
      setFriends(data);
    } catch (err) {
      console.error('Error fetching friends:', err);
      Alert.alert('Error', 'Failed to load friends list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleRemoveFriend = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${baseUrl}/friendship/unfriend?userId=${user.id}&friendId=${selectedFriendId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to unfriend: ${response.status}`);
      }

      // Optional: get response JSON if needed
      const data = await response.json();
      console.log('Unfriend response:', data);

      // Remove friend from local state so UI updates immediately
      setFriends(prev =>
        prev.filter(friend => friend?.id !== selectedFriendId),
      );
      setShowConfirmModal(false);
      Alert.alert('Success', 'Friend removed successfully!');
    } catch (err) {
      console.error('Error removing friend:', err);
      setShowConfirmModal(false);
      Alert.alert('Error', 'Failed to remove friend.');
    }
  };
  const confirmRemoveFriend = friendId => {
    setSelectedFriendId(friendId);
    setShowConfirmModal(true);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      <Text style={tw`font-semibold text-center text-xl mt-4`}>
        Friends List
      </Text>

      {loading ? (
        <ActivityIndicator style={tw`mt-10`} size="large" color="#F6444E" />
      ) : (
        <FlatList
          data={friends}
          style={tw`px-6 mt-4`}
          keyExtractor={item => item?.id?.toString()}
          renderItem={({ item }) => (
            <FriendListItem
              user={item}
              variant="friends"
              onRemoveFriend={confirmRemoveFriend}
            />
          )}
          ListEmptyComponent={
            <Text style={tw`text-center text-gray-500 mt-10`}>
              No friends found.
            </Text>
          }
        />
      )}
      <ConfirmModal
        visible={showConfirmModal}
        title="Remove Friend"
        message="Are you sure you want to unfriend?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleRemoveFriend}
        onCancel={() => setShowConfirmModal(false)}
      />
    </SafeAreaView>
  );
};

export default FriendList;
