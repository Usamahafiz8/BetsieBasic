import React, { useEffect, useState } from "react";
import { Text, View, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LinearGradient from "react-native-linear-gradient";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import tw from "../../../../lib/tailwind";
import Images from "../../../../constant/Images";
import GradientText from "../../../../components/GradientText";
import type  BottomSheetMethods  from "@gorhom/bottom-sheet";
import { useBetsieStore } from "../../../../store/useBetsieStore";
import { baseUrl } from "../../../../api/baseUrl";

dayjs.extend(utc);
dayjs.extend(timezone);

// ✅ Navigation types
export type RootStackParamList = {
  Home: undefined;
  BetDetail: { bet: BetProps };
};

// ✅ Card props type
export interface BetProps {
  id: number;
  avatar?: string | number;
  name: string;
  title: string;
  description: string;
  date: string;
  status: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  bottomSheetRef?: React.RefObject<BottomSheetMethods | null>;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    playerName?: string;
    email: string;
    profilePicture?: string | null;
  };
}

// ✅ Component
const MyFeedCard: React.FC<BetProps> = ({
  id,
  avatar,
  name,
  title,
  description,
  date,
  status,
  likesCount = 0,
  commentsCount = 0,
  sharesCount = 0,
  bottomSheetRef,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [commentCount, setCommentCount] = useState<number | null>(null);
  const { token } = useBetsieStore();

  const formattedDate = dayjs
    .utc(date)
    .tz(dayjs.tz.guess())
    .format("MMMM DD, YYYY | hh:mm A");

  const statusColors: Record<string, string[]> = {
    Active: ["#B71C1C", "#F44336"],
    Pending: ["#B71C1C", "#F44336"],
    Completed: ["#B71C1C", "#F44336"],
    Disputed: ["#B71C1C", "#F44336"],
    Default: ["#B71C1C", "#F44336"],
  };

  // ✅ Fetch comments dynamically
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const res = await fetch(`${baseUrl}/comments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setCommentCount(data.data.length);
        } else {
          console.warn("Failed to fetch comments:", data.message);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    if (id && token) {
      fetchCommentCount();
    }
  }, [id, token]);

  return (
    <View style={tw`bg-white rounded-lg shadow-sm mb-4`}>
      {/* Header */}
      <View style={tw`flex-row mt-4 mb-2 px-4`}>
        <Image
          source={
            typeof avatar === "string"
              ? { uri: avatar }
              : (avatar as any) || Images.player1
          }
          style={tw`w-16 h-16 rounded-full`}
        />
        <View style={tw`flex-1 ml-4`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-base font-bold text-black`}>{name}</Text>
            <GradientText
              text={` (${status})`}
              style={tw`text-sm font-semibold ml-2`}
              colors={statusColors[status] || statusColors.Default}
            />
          </View>
          <Text style={tw`text-sm text-gray-600`}>{formattedDate}</Text>
        </View>
      </View>

      {/* Title & Description */}
      <Text style={tw`text-base font-semibold text-black ml-4`}>{title}</Text>
      <Text style={tw`text-black text-xs ml-4 mt-2`} numberOfLines={3}>
        {description}
      </Text>

      {/* Actions */}
      <View style={tw`flex-row items-center justify-between mt-4 mb-4 px-6`}>
        {/* Likes */}
        <Pressable style={tw`flex-row items-center`}>
          <Image
            source={Images.heart}
            style={tw`w-4 h-4 mr-1`}
            resizeMode="contain"
          />
          <Text style={tw`text-sm text-black`}>{likesCount} Likes</Text>
        </Pressable>

        {/* Shares */}
        <Pressable
          style={tw`flex-row items-center`}
          onPress={() => bottomSheetRef?.current?.snapToIndex(0)}
        >
          <Image
            source={
              sharesCount > 0 ? Images.sharefilled : Images.shareunfilled
            }
            style={tw`w-4 h-4 mr-1`}
            resizeMode="contain"
          />
          <Text style={tw`text-sm text-black`}>
            {sharesCount > 0 ? `${sharesCount} Shares` : "Share"}
          </Text>
        </Pressable>

        {/* Comments */}
        <Pressable
          style={tw`flex-row items-center`}
          onPress={() =>
            navigation.navigate("BetDetail", {
              bet: {
                id,
                avatar,
                name,
                title,
                description,
                date,
                status,
              },
            })
          }
        >
          <Image
            source={
              (commentCount || commentsCount) > 0
                ? Images.commentred
                : Images.commentgrey
            }
            style={tw`w-4 h-4 mr-1`}
            resizeMode="contain"
          />
          <Text style={tw`text-sm text-black`}>
            {(commentCount || commentsCount) > 0
              ? `${commentCount ?? commentsCount} Comments`
              : "Comments"}
          </Text>
        </Pressable>
      </View>

      {/* Divider */}
      <LinearGradient
        colors={["rgba(246, 68, 78, 0)", "#F6444E", "rgba(246, 68, 78, 0)"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={tw`h-[1px] w-full`}
      />
    </View>
  );
};

export default MyFeedCard;
