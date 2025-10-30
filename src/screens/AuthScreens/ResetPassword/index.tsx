import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
  View
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import tw from "../../../lib/tailwind";
import Loader from "../../../constant/Loader";
import Images from "../../../constant/Images";
import { Fonts } from "../../../constant/Fonts";
import Button from "../../../components/Button";
import { Colors } from "../../../constant/Colors";
import InputField from "../../../components/InputField";
import CustomToast from "../../../components/CustomToast";
import { useApiRequest } from "../../../api/useApiRequest";
import { END_POINTS } from "../../../api/END_POINTS";
import {styles} from "./styles"
import { useBetsieStore } from "../../../store/useBetsieStore";
import Header from "../../../components/Header";

type RootStackParamList = {
     CheckEmail: { email: string }; 
  Home: undefined;
  AccountCreation: undefined;
  ResetPassword: undefined; 
  SignIn: undefined;
};


// The type definition was too specific.
// It is now updated to allow navigation to any screen in the stack.
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ToastState = { message: string; type: "error" | "success" } | null;

const ResetPassword: React.FC = () => {

  const { setUser } = useBetsieStore();
  const apiRequest = useApiRequest();
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const handleSubmit = async () => {
    if (!email.includes("@") || !email.includes(".com")) {
      setToast({ message: "Please enter a valid email address", type: "error" });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const payload = { email };

      console.log("🐛 Debug: Payload being sent:", payload);

      const response: any = await apiRequest(END_POINTS.PASSWORD_RESET_REQUEST, payload);

      // Console mein poora response object dekhein, isse success property ka pata chal jayega
      console.log("🐛 Debug: Full API response object:", response);
      
      // The API is returning a string, not an object with a .success property.
      // We check if the response string contains the word "sent" to determine success.
      if (typeof response === 'string' && response.toLowerCase().includes("sent")) {
        setToast({
          message: "Password reset link sent to your email",
          type: "success",
        });

        // Navigate immediately after setting the success toast.
        navigation.navigate("CheckEmail", { email }); 
      } else {
        // Only show a toast, don't navigate on failure
        console.log("❌ Not navigating because the response did not indicate success.");
        setToast({
          message: response?.message || "Something went wrong. Please try again.",
          type: "error",
        });
      }

    } catch (error) {
      console.error("❌ API Error:", error);
      setToast({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={tw`flex-1 bg-white`}
    >
      {loading && <Loader />}

      <Header />

      <View style={tw`flex-1 px-5 mt-6`}>
        {/* Title */}
        <Text
          style={[
            tw`text-center mb-6`,
            { fontFamily: Fonts.FunnelBold, fontSize: 20, color: Colors.black },
          ]}
        >
          Password Recovery
        </Text>

        <Text
          style={[
            tw`text-center mb-6`,
            { fontFamily: Fonts.FunnelMedium, fontSize: 12, color: Colors.black },
          ]}
        >
          Enter the email address associated with your account. If an account exists, we will send you a password reset link.
        </Text>
        <InputField
          label="Enter your email"
          icon={Images.email}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Submit Button */}
        <Button title="Send Recovery Link" onPress={handleSubmit} style={tw`mt-8 mb-8`} />

        <View style={tw`flex-1 px-5 mr-6 ml-6`}>
          <Text
            style={[
              tw`text-center `,
              { fontFamily: Fonts.FunnelMedium, fontSize: 12, color: Colors.black },
            ]}
          >
            Note: If you signed up using Apple, Google, or Facebook, please return to the Sign In screen and use those options.
          </Text>

                  <TouchableOpacity onPress={() => navigation.navigate('SignIn' as any)}>
                  <Text style={styles.backToSignInLink}>Back to Log In</Text>
                </TouchableOpacity>
        </View>
        {/* Back to Login */}
        {/* <Text
          style={[
            tw`text-center mt-6`,
            { fontFamily: Fonts.FunnelRegular, fontSize: 14, color: Colors.black },
          ]}
          onPress={() => navigation.navigate("SignIn")}
        >
          Back to Login
        </Text> */}
        
      </View>

      {/* Toast Message */}
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
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;
