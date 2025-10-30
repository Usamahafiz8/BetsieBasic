import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import tw from '../../lib/tailwind';
import BottomSheet from '@gorhom/bottom-sheet';
import GradientBorder from '../GradientBorder';
import Images from '../../constant/Images';

const CommentSection = () => {
  const [comments, setComments] = useState([
    {
      id: '1',
      name: 'Real Name',
      text: 'Comments which user have added here.',
      time: '2 Hours Ago',
    },
  ]);
  const [input, setInput] = useState('');

  const bottomSheetRef = useRef<BottomSheet>(null);
  // console.log("🚀 ~ CommentSection ~ bottomSheetRef:", bottomSheetRef)
  const snapPoints = ['60%'];

  const handleAddComment = () => {
    if (!input.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      name: 'Real Name',
      text: input,
      time: 'Just now',
    };
    setComments([newComment, ...comments]);
    setInput('');
  };

  const latestComment = comments[0];
  const totalComments = comments.length;

  return (
    <View style={tw`bg-white`}>
      {/* Header */}
      <View style={tw`border-b-2 border-[#FF93A0]`}>
        <TouchableOpacity
          style={tw`pt-8 pb-3  flex-row justify-end`}
          onPress={() => bottomSheetRef.current?.expand()}
          >
          <Text style={tw`text-base font-medium`}>
            {totalComments} Comments
          </Text>

        </TouchableOpacity>
      </View>

      {/* Latest Comment */}
      {latestComment && (
        <View style={tw`p-4 flex-row`}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={tw`w-10 h-10 rounded-full mr-3`}
          />
          <View style={tw`flex-1`}>
            <Text style={tw`font-medium text-base`}>{latestComment.name}</Text>
            <Text style={tw`text-xs font-light`}>{latestComment.time}</Text>
            <Text style={tw`text-base mt-1`}>{latestComment.text}</Text>
            <View style={tw`flex-row mt-1 justify-end`}>
              <Text style={tw`text-pink-500 mr-4`}>Like</Text>
              <Text style={tw`text-sm`}>Reply</Text>
            </View>
          </View>
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80} // adjust if header overlaps on iOS
      >
        <View style={tw`mb-4`}>
          <GradientBorder style={tw`flex-row items-center px-3 py-1`}>
            {/* Emoji button */}
            <TouchableOpacity>
              <Image
                source={Images.smiley}
                style={tw`w-7 h-7`}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Input field */}
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Comment"
              placeholderTextColor="#999"
              style={tw`flex-1 px-3 text-base text-black`}
              //   onSubmitEditing={handleSend} // press enter
              returnKeyType="send"
            />

            {/* Send button */}
            <TouchableOpacity /* onPress={handleSend} */>
              <Image
                source={Images.send}
                style={tw`w-8 h-8`}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </GradientBorder>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Sheet for full list */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={tw`bg-white rounded-t-xl`}
        handleIndicatorStyle={tw`bg-gray-300`}
      >
        <FlatList
          data={comments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={tw`p-4 flex-row`}>
              <Image
                source={{
                  uri: 'https://randomuser.me/api/portraits/men/32.jpg',
                }}
                style={tw`w-10 h-10 rounded-full mr-3`}
              />
              <View style={tw`flex-1`}>
                <Text style={tw`font-bold`}>{item.name}</Text>
                <Text style={tw`text-xs text-gray-500`}>{item.time}</Text>
                <Text style={tw`text-sm mt-1`}>{item.text}</Text>
                <View style={tw`flex-row mt-1`}>
                  <Text style={tw`text-pink-500 mr-4`}>Like</Text>
                  <Text style={tw`text-gray-500`}>Reply</Text>
                </View>
              </View>
            </View>
          )}
        />
      </BottomSheet>
    </View>
  );
};

export default CommentSection;
