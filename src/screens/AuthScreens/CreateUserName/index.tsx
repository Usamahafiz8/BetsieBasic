import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import tw from "../../../lib/tailwind";
import Images from "../../../constant/Images";
import Loader from "../../../constant/Loader";
import Button from "../../../components/Button";
import Content from "../../../components/text/Content";
import InputField from "../../../components/InputField";
import CustomToast from "../../../components/CustomToast";
import { useBetsieStore } from "../../../store/useBetsieStore";
import { baseUrl } from "../../../api/baseUrl";
import Header from "../../../components/Header";

// ✅ Define proper types for the navigation stack
type RootStackParamList = {
  Home: undefined;
  CreateUserName: { email: string; id: number; token: string };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreateUserName"
>;
type CreateUserNameRouteProp = RouteProp<RootStackParamList, "CreateUserName">;

const CreateUserName: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CreateUserNameRouteProp>();
  const { id, email, token } = route.params;
  const { saveAuthData, setUser } = useBetsieStore(state => state);


  const [playerName, setPlayerName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

const handleUserName = async () => {
  if (!playerName || playerName.trim().length < 3) {
    setToast({
      message: "Player name must be at least 3 characters.",
      type: "error",
    });
    return;
  }

  setLoading(true);
  setToast(null);

  try {
    const response = await fetch(`${baseUrl}/users/${id}/player-name`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ correct token
      },
      body: JSON.stringify({ playerName }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to update player name");
    }

    console.log("✅ Player name updated:", data);

    // ✅ store token + updated user properly
    saveAuthData(token, data.user || data); // depends on API shape
    setUser(data.user || data);

    setToast({
      message: "Player name updated successfully!",
      type: "success",
    });

    navigation.navigate("Home");
  } catch (error: any) {
    console.error("❌ Error updating player name:", error.message);
    setToast({
      message: error.message || "An unexpected error occurred. Please try again.",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {loading && <Loader />}
      {toast && (
        <CustomToast
          message={toast.message}
          borderColors={
            toast.type === "error"
              ? ["#EF4444", "#DC2626"]
              : ["#10B981", "#059669"]
          }
          onHide={() => setToast(null)}
        />
      )}
      <Header showBack onPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={tw`flex-1 px-6 pt-8`}>
        <Content
          text="Create Your Username"
          style={tw`text-xl font-bold text-center mb-4`}
        />

        <Text style={tw`text-base text-black mb-6 text-center`}>
          Your username will be public and used to identify you in the Betsie
          app.
        </Text>

        <View style={tw`mb-6`}>
          <InputField
            label="Player Name"
            icon={Images.att}
            value={playerName}
            onChangeText={setPlayerName}
          />
          <Text style={tw`text-sm text-black mt-2`}>
            Must be 3-20 characters long. No special characters or spaces.
          </Text>
        </View>

        <Button onPress={handleUserName} title="Save & Continue" />

        <Text style={tw`text-sm text-center text-black mt-8`}>
          Note: If you signed up using Apple, Google, or {"\n"}
          Facebook, please return to the Sign In screen {"\n"}
          and use those options.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateUserName;
