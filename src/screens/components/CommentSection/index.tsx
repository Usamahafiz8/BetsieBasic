import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import tw from "../../../lib/tailwind";
import BottomSheet from "@gorhom/bottom-sheet";
import GradientBorder from "../../../components/GradientBorder";
import Images from "../../../constant/Images";
import { baseUrl } from "../../../api/baseUrl";
import { useBetsieStore } from "../../../store/useBetsieStore";

// ⏱️ Helper to convert timestamp to “time ago”
const timeAgo = (timestamp: string) => {
  const diff = (Date.now() - new Date(timestamp).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    playerName?: string;
    profilePicture?: string | null;
  };
}

interface Props {
  betId: number;
  userId: number;
  open?: boolean;
  style?: any;
  onClose?: () => void;
}

const CommentSection: React.FC<Props> = ({
  betId,
  userId,
  open = false,
  style,
  onClose,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const { token } = useBetsieStore();
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const inputRef = useRef<TextInput | null>(null);
  const snapPoints = ["70%"];

  // 🔹 Fetch comments
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/bets/${betId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments(data.data || []);
      } else {
        console.warn("Fetch comments failed:", data.message);
      }
    } catch (err) {
      console.error("Fetch comments error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Post new comment
  const handleAddComment = async () => {
    if (!input.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`${baseUrl}/comments/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ betId, userId, content: input.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Append new comment to list
        setComments((prev) => [data.data, ...prev]);
        setInput("");
        inputRef.current?.focus();
      } else {
        Alert.alert("Error", data.message || "Failed to post comment");
      }
    } catch (err) {
      console.error("Post comment error:", err);
      Alert.alert("Error", "Unable to post comment");
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [betId]);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomSheetRef.current?.expand(), 100);
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [open]);

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={tw`flex-row items-start px-4 py-3 border-b border-gray-100`}>
      {/* <Image
  source={
    item.author?.profilePicture
      ? { uri: item.author.profilePicture }
      : Images.player2
  }
  style={tw`w-10 h-10 rounded-full mr-3`}
/> */}


 <Image
                  source={
                   item.author?.profilePicture
                      ? { uri: item.author?.profilePicture }
                      : Images.avatar
                  }
                  resizeMode="cover"
                  style={tw`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200`}
                />
      <View style={tw`flex-1`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`font-semibold text-black`}>
            {item.author?.playerName }
          </Text>
          <Text style={tw`text-xs text-gray-400`}>{timeAgo(item.createdAt)}</Text>
        </View>
        <Text style={tw`text-gray-700 mt-1`}>{item.content}</Text>
        {/* <View style={tw`flex-row justify-end mt-2`}>
          <TouchableOpacity style={tw`mr-4`}>
            <Text style={tw`text-pink-500 text-xs`}>❤️ Like</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={tw`text-gray-500 text-xs`}>💬 Reply</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={tw`bg-white px-4 py-2 flex-row items-center justify-center`}
        onPress={() => {
          bottomSheetRef.current?.expand();
          setTimeout(() => inputRef.current?.focus(), 300);
        }}
      >
        <Text style={tw`text-sm font-medium`}>
          ({comments.length}) All Comments
        </Text>
      </TouchableOpacity>

      {/* Inline comment preview */}
      {loading ? (
        <ActivityIndicator size="small" color="#FF094E" style={tw`mt-2`} />
      ) : comments.length > 0 ? (
        <FlatList
          data={comments.slice(0, 4)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCommentItem}
        />
      ) : (
        <Text style={tw`text-center text-gray-500 mt-3`}>
          No comments yet. Be the first!
        </Text>
      )}

      {/* Comment input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={tw`p-3 bg-white`}>
          <GradientBorder style={tw`flex-row items-center px-3 py-1`}>
            <TouchableOpacity style={tw`mr-2`}>
              <Image
                source={Images.smiley}
                style={tw`w-7 h-7`}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              placeholder="Write a comment..."
              placeholderTextColor="#999"
              style={tw`flex-1 px-3 text-base text-black`}
              returnKeyType="send"
              onSubmitEditing={handleAddComment}
            />

            <TouchableOpacity
              onPress={handleAddComment}
              disabled={posting}
              style={tw`ml-2`}
            >
              {posting ? (
                <ActivityIndicator size="small" color="#FF094E" />
              ) : (
                <Image
                  source={Images.send}
                  style={tw`w-8 h-8`}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </GradientBorder>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={tw`bg-white rounded-t-xl`}
        handleIndicatorStyle={tw`bg-gray-300`}
        onClose={() => onClose && onClose()}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#FF094E" style={tw`mt-4`} />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCommentItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
});

export default CommentSection;
