import React, { useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import tw from "../../../lib/tailwind";
import Button from "../../../components/Button";
import { useApiRequest } from "../../../api/useApiRequest";
import { useBetsieStore } from "../../../store/useBetsieStore";
import Images from "../../../constant/Images";
import { END_POINTS } from "../../../api/END_POINTS";

const MyBets = () => {
  const navigation = useNavigation();
  const apiRequest = useApiRequest();
  const { user } = useBetsieStore();

  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 justify-center items-center`}>
        {/* Loader */}
        {loading ? (
          <ActivityIndicator size="large" color="#FF094E" />
        ) : (
          <>
            {/* ✅ Profile Image */}

            <View style={tw`w-50 h-50  mt-20 items-center justify-center`}>
              <Image
                source={Images.hiwaving}
                style={tw`w-45 h-45`} // slightly smaller than parent
                resizeMode="contain" // ensures full image fits inside
              />
            </View>

            {/* Greeting */}
            <Text style={tw`text-xl font-bold text-black mb-2`}>
              Hi, {user?.playerName}!
            </Text>
          </>
        )}
        <Text style={tw`text-sm  items-center justify-center text-gray-800 mb-1`}>
          You’re officially part of the Betsie squad. 🎊
          Connect with friends, create fun challenges, and place friendly bets.
          Add your friends, set up your first bet, and let the games begin!
        </Text>
        {/* Placeholder text */}
        {/* <Text style={tw`text-sm text-gray-600 mb-1`}>
          [Text that goes here needed from client]
        </Text> */}
        {/* <Text style={tw`text-sm text-gray-600 mb-4`}>
          [Text that goes here needed from client]
        </Text> */}

        {/* Create Bet Button */}
        <Button
          title="Create Bet"
          onPress={() => navigation.navigate("DefineBet" as never)}
          style={tw`mt-4`}
        />
      </View>
    </SafeAreaView>
  );
};

export default MyBets;
