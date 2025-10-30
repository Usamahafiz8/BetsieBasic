import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { io, socket } from 'socket.io-client';

import tw from '../../../lib/tailwind';
import Header from '../../../components/Header';
import Images from '../../../constant/Images';
import GradientBorder from '../../../components/GradientBorder';
import { useBetsieStore } from '../../../store/useBetsieStore';
import { baseUrl } from '../../../api/baseUrl';

const StakeDiscussionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { betId, friendName, friendAvatar, friendId } = route.params as {
    betId: number;
    friendName: string;
    friendAvatar: string;
    friendId: number;
  };

  const { token, user } = useBetsieStore();
  console.log("🚀 ~ StakeDiscussionScreen ~ user Id:", user?.id, betId)
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const socketRef = useRef<any>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${baseUrl}/chat/bet/${betId}/user/${friendId}/messages?limit=50`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!res.ok) throw new Error('Failed to load messages');
      const data = await res.json();
      setMessages(data.data.messages || []);
    } catch (err) {
      console.log('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
 
  
  fetchMessages();
 
}, [refresh]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      betId,
      receiverId: friendId,
      message: input,
    };

    setInput('');

    try {
      const res = await fetch(`${baseUrl}/chat/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Failed to send message', await res.text());
      } else {
        // Emit message through socket
        socketRef.current.emit('sendMessage', {
          ...newMessage,
          senderId: user?.id,
        });
        setrefresh(!refresh)
      }
    } catch (err) {
      console.log('Error sending message:', err);
    }
  };

  const renderMessage = ({ item }: any) => {
    console.log('🚀 ~ renderMessage ~ item:', item);
    const isMe = item.senderId === user?.id;

    return (
      <View
        style={tw`flex-row items-center px-4 py-2 ${
          isMe ? 'justify-start' : 'justify-end'
        }`}
      >
        {/* 🧑 My message (left side) */}
        {isMe ? (
          <>
            {/* Avatar */}
            <Image
              source={{ uri: user?.profilePicture }}
              style={tw`w-10 h-10 rounded-full mr-2 border-2 border-red-500`}
            />
            {/* Bubble */}
            <View style={tw`max-w-[70%]`}>
              <Text style={tw`font-bold text-xs mb-1`}>
                {user?.playerName}
              </Text>
              <Text style={tw`text-black text-xs font-regular`}>
                {item.message}
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Bubble */}
            <View style={tw`max-w-[70%] items-end`}>
              <Text style={tw`font-bold text-xs mb-1`}>
                {friendName} {/* pass friend name from props */}
              </Text>
              <Text style={tw`text-black text-xs font-regular`}>
                {item.message}
              </Text>
            </View>
            {/* Avatar */}
            <Image
              source={{ uri: friendAvatar }}
              style={tw`w-10 h-10 rounded-full ml-2 border-2 border-red-500`}
            />
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      <View style={tw`items-center py-4`}>
        <Text style={tw`font-semibold text-lg`}>Private Chat</Text>
      </View>

      {messages.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-base font-regular text-center px-10`}>
            Not sure about the stakes?{'\n'}Discuss them here.
          </Text>
        </View>
      ) : (
        <FlatList
          inverted
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={tw`pb-24`}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={tw`mx-4 mb-4`}>
          <GradientBorder style={tw`flex-row items-center px-3 py-1`}>
            <TouchableOpacity>
              <Image
                source={Images.smiley}
                style={tw`w-7 h-7`}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Message"
              placeholderTextColor="#999"
              style={tw`flex-1 px-3 text-base text-black`}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={handleSend}>
              <Image
                source={Images.send}
                style={tw`w-8 h-8`}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </GradientBorder>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default StakeDiscussionScreen;
