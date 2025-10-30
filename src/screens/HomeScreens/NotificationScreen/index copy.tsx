// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   FlatList,
//   Text,
//   View,
//   Image,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';

// import tw from '../../../lib/tailwind';
// import Button from '../../../components/Button';
// import { baseUrl } from '../../../api/baseUrl';
// import { useBetsieStore } from '../../../store/useBetsieStore';
// import Header from '../../../components/Header';

// // 🔹 Friend Request Type
// type PendingRequest = {
//   id: string;
//   playerName: string;
//   avatar?: string;
// };

// // 🔹 Notification Type
// type NotificationItem = {
//   id: number;
//   title: string;
//   message: string;
//   senderName?: string;
//   avatar?: string;
//   type: 'bet' | 'friend' | 'system';
//   createdAt: string;
// };

// const NotificationScreen: React.FC = () => {
//   const navigation = useNavigation();
//   const { token, user } = useBetsieStore();

//   const [requests, setRequests] = useState<PendingRequest[]>([]);
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ 1️⃣ Fetch Pending Friend Requests
//   const fetchPendingRequests = async () => {
//     if (!user?.id) return;
//     setLoading(true);

//     try {
//       const res = await fetch(`${baseUrl}/friendship/pending/${user.id}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const responseText = await res.text();
//       if (!res.ok) throw new Error(`Error: ${res.status}`);

//       const data = JSON.parse(responseText);
//       const mapped: PendingRequest[] = data.map((req: any) => ({
//         id: req.requester.id?.toString(),
//         playerName: req.requester.playerName,
//         avatar: req.requester.profilePicture,
//       }));

//       setRequests(mapped);
//     } catch (err) {
//       console.error('❌ Failed to fetch pending requests:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ 2️⃣ Fetch Notifications (Fixed to Extract Sender Name)
//   const recievedNotifications = useCallback(async () => {
//     if (!token) return;
//     setLoading(true);

//     try {
//       const res = await fetch(`${baseUrl}/notifications`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const text = await res.text();
//       if (!res.ok) throw new Error(`Error: ${res.status}`);

//       const data = JSON.parse(text);

//       const mapped: NotificationItem[] = data.map((item: any) => {
//         // 🧠 Smart extraction of sender name from message
//         let extractedName = 'Unknown';
//         if (item.message) {
//           // Match names like “Harmain Arain sent you…” or “Mano Bili commented…”
//           const match = item.message.match(
//             /^([A-Za-zÀ-ÿ\s]+?)(?=\s(?:sent|commented|accepted|challenged|unfriended|requested))/i
//           );
//           if (match && match[1]) {
//             extractedName = match[1].trim();
//           }
//         }

//         return {
//           id: item.id,
//           title: item.title || 'New Notification',
//           message: item.message || 'You received a new update',
//           senderName: extractedName,
//           avatar:
//             item.senderAvatar ||
//             'https://cdn-icons-png.flaticon.com/512/847/847969.png',
//           type: item.type || 'system',
//           createdAt: item.createdAt,
//         };
//       });

//       setNotifications(mapped);
//     } catch (error) {
//       console.error('❌ Error fetching notifications:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   // ✅ 3️⃣ Accept / Decline Bet Requests
//   const acceptBetRequest = async (notificationId: number) => {
//     try {
//       const response = await fetch(`${baseUrl}/bets/accept`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ notificationId, userId: user?.id }),
//       });

//       if (!response.ok) throw new Error('Failed to accept bet request');

//       Alert.alert('✅ Success', 'Bet request accepted!');
//       setNotifications(prev => prev.filter(n => n.id !== notificationId));
//     } catch (error) {
//       console.error('Error accepting bet request:', error);
//       Alert.alert('Error', 'Unable to accept bet request');
//     }
//   };

//   const declineBetRequest = async (notificationId: number) => {
//     try {
//       const response = await fetch(`${baseUrl}/bets/decline`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ notificationId, userId: user?.id }),
//       });

//       if (!response.ok) throw new Error('Failed to decline bet request');

//       Alert.alert('❌ Declined', 'Bet request declined.');
//       setNotifications(prev => prev.filter(n => n.id !== notificationId));
//     } catch (error) {
//       console.error('Error declining bet request:', error);
//       Alert.alert('Error', 'Unable to decline bet request');
//     }
//   };

//   // ✅ 4️⃣ Accept / Decline Friend Requests
//   const acceptFriendRequest = async (requesterId: number) => {
//     try {
//       const response = await fetch(`${baseUrl}/friendship/accept`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ requesterId, receiverId: user?.id }),
//       });

//       if (!response.ok) throw new Error('Failed to accept friend request');

//       Alert.alert('Success', 'Friend request accepted!');
//       setRequests(prev =>
//         prev.filter(req => req.id !== requesterId.toString()),
//       );
//     } catch (error) {
//       console.error('Error accepting friend request:', error);
//       Alert.alert('Error', 'Failed to accept friend request');
//     }
//   };

//   const declineFriendRequest = async (senderId: number) => {
//     try {
//       const response = await fetch(`${baseUrl}/friendship/decline`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ senderId, receiverId: user?.id }),
//       });

//       if (!response.ok) throw new Error('Failed to decline friend request');

//       Alert.alert('Success', 'Friend request declined!');
//       setRequests(prev => prev.filter(req => req.id !== senderId.toString()));
//     } catch (error) {
//       console.error('Error declining friend request:', error);
//       Alert.alert('Error', 'Failed to decline friend request');
//     }
//   };

//   // ✅ 5️⃣ Poll every 10 seconds
//   useEffect(() => {
//     recievedNotifications();
//     fetchPendingRequests();
//     const interval = setInterval(recievedNotifications, 10000);
//     return () => clearInterval(interval);
//   }, [recievedNotifications]);

//   // ✅ Render Bet / System Notification
//   const renderNotification = ({ item }: { item: NotificationItem }) => {
//     const isBet = item.type === 'bet';

//     return (
//       <View style={tw`flex-row items-center justify-between py-3`}>
//         <View style={tw`flex-row items-center flex-1`}>
//           <Image
//             source={{ uri: item.avatar }}
//             style={tw`w-12 h-12 rounded-full border-2 border-red-500 mr-3`}
//           />
//           <View style={tw`flex-1`}>
//             <Text style={tw`text-base font-bold`}>
//               {item.senderName || 'Unknown'}
//             </Text>
//             <Text style={tw`text-sm text-gray-600`}>{item.message}</Text>
//             <Text style={tw`text-xs text-gray-400 mt-1`}>
//               {new Date(item.createdAt).toLocaleString()}
//             </Text>
//           </View>
//         </View>

//         {isBet && (
//           <View style={tw`items-end`}>
//             <TouchableOpacity
//               onPress={() => acceptBetRequest(item.id)}
//               style={tw`bg-[#F6444E] px-3 py-1.5 rounded-full mb-1`}
//             >
//               <Text style={tw`text-white text-xs font-semibold`}>Accept</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => declineBetRequest(item.id)}
//               style={tw`border border-[#F6444E] px-3 py-1.5 rounded-full`}
//             >
//               <Text style={tw`text-[#F6444E] text-xs font-semibold`}>
//                 Decline
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     );
//   };

//   // ✅ Render Friend Request
//   const renderRequest = ({ item }: { item: PendingRequest }) => (
//     <View style={tw`flex-row items-center justify-between py-3`}>
//       <View style={tw`flex-row items-center flex-1`}>
//         <Image
//           source={{
//             uri:
//               item.avatar ||
//               'https://cdn-icons-png.flaticon.com/512/847/847969.png',
//           }}
//           style={tw`w-14 h-14 rounded-full border-2 border-red-500 mr-3`}
//         />
//         <View style={tw`flex-1`}>
//           <Text style={tw`text-base font-bold`}>
//             {item.playerName || 'Unknown'}
//           </Text>
//           <Text style={tw`text-sm text-gray-600`}>
//             sent you a friend request.
//           </Text>
//         </View>
//       </View>

//       <View style={tw`items-end`}>
//         <Button
//           title="Accept"
//           textStyle={tw`font-regular text-sm`}
//           variant="filled"
//           onPress={() => acceptFriendRequest(Number(item.id))}
//         />
//         <View style={tw`mt-2`}>
//           <Button
//             title="Decline"
//             textStyle={tw`font-regular text-sm`}
//             variant="outlined"
//             onPress={() => declineFriendRequest(Number(item.id))}
//           />
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={tw`flex-1 bg-white`}>
//       <Header title="Notifications" />

//       {loading ? (
//         <ActivityIndicator style={tw`mt-10`} size="large" color="#F6444E" />
//       ) : (
//         <FlatList
//           data={[...requests, ...notifications]}
//           keyExtractor={(item: any) => item.id.toString()}
//           renderItem={({ item }: any) =>
//             'playerName' in item
//               ? renderRequest({ item })
//               : renderNotification({ item })
//           }
//           contentContainerStyle={tw`px-4 pb-4`}
//           ListEmptyComponent={
//             <Text style={tw`text-center text-gray-500 mt-10`}>
//               No Notifications Yet.
//             </Text>
//           }
//           refreshing={loading}
//           onRefresh={() => {
//             fetchPendingRequests();
//             recievedNotifications();
//           }}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// export default NotificationScreen;
