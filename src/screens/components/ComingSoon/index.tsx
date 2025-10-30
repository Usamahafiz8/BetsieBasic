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

const ComingSoon = () => {
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

            <View style={tw`w-80 h-80 items-center justify-center`}>
              <Image
                source={Images.comingsoon}
                style={tw`w-70 h-70`} // slightly smaller than parent
                resizeMode="contain" // ensures full image fits inside
              />
            </View>

            {/* Greeting */}
            <Text style={tw`text-xl font-bold text-black mb-2`}>
              Hi, {user?.playerName}!
            </Text>
          </>
        )}

        {/* Placeholder text */}
        <Text style={tw`text-sm text-gray-800 mb-1 text-center`}>
          This feature will be coming soon.
        </Text>
        <Text style={tw`text-sm text-gray-800 mb-4 text-center`}>
          Stay tuned for updates....!
        </Text>


        {/* Create Bet Button */}
        <Button
          title="Go Back"
          onPress={() => navigation.navigate("DefineBet" as never)}
          style={tw`mt-4`}
        />
      </View>
    </SafeAreaView>
  );
};

export default ComingSoon;
