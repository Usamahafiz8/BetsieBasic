import 'react-native-get-random-values';

import { GPT_KEY } from '@env';
import axios from 'axios';
import React, { useCallback, useEffect,useState } from 'react';
import { SafeAreaView,StyleSheet, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { v4 as uuidv4 } from 'uuid';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const welcomeMsg = {
      _id: uuidv4(),
      text: "Hi! I’m Betsie Bot 🤖. How can I help you today?",
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'system',
        avatar: require('../assets/images/chatgpt.jpeg'),
      },
    };
    setMessages([welcomeMsg]);
  }, []);

  const myPrompt = (text) => {
    const url = 'https://api.openai.com/v1/chat/completions';
    const config = {
      headers: {
        Authorization: `Bearer ${GPT_KEY}`,
      },
    };
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Keep answers short.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
      stream: false,
    };

    setLoading(true);
    axios
      .post(url, data, config)
      .then((res) => {
        const result = res.data.choices[0].message.content;
        const botReply = {
          _id: uuidv4(),
          text: result,
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'system',
            avatar: require('../assets/images/chatgpt.jpeg'),
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, botReply),
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log('🧠 💡 error raised', error);
        alert(error?.response?.data?.error?.message || 'API error occurred');
        setLoading(false);
      });
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
    myPrompt(messages[0]?.text);
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <GiftedChat
          isTyping={isLoading}
          messages={messages}
          onSend={(messages) => onSend(messages)}
          showUserAvatar
          user={{
            _id: 2,
            avatar: require('../assets/images/user.png'),
            name: 'user',
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chatbot;
