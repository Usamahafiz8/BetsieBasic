import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import { styles } from "./styles";
import Button from "../../../components/Button";
import CustomToast from "../../../components/CustomToast";
import { Colors } from "../../../constant/Colors";
import { Fonts } from "../../../constant/Fonts";
import Images from "../../../constant/Images";
import Loader from "../../../constant/Loader";
import tw from "../../../lib/tailwind";
import Header from "../../../components/Header";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  CheckEmail: { email: string };
  Home: undefined;
  AccountCreation: undefined;
  ResetPassword: undefined;
  SignIn: undefined;
};

type CheckEmailRouteProp = RouteProp<RootStackParamList, "CheckEmail">;

const CheckEmail: React.FC<{ route: CheckEmailRouteProp; navigation: any }> = ({ route, navigation }) => {
  const { email } = route.params;  // 👇 email comes from previous screen
  // const { email } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "error" | "success";
  }>({
    visible: false,
    message: "",
    type: "error",
  });

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={tw`flex-1 bg-white`}
      >
        {loading && <Loader />}

        <Header />

        <View style={tw`flex-1 px-5 mt-6`}>
          {/* SVG Icon */}
          <View style={tw`mb-10 mt-50 items-center justify-between`}>
            <Images.emailsvg width={80} height={80} />
          </View>

          <Text
            style={[
              tw`text-center mb-6`,
              {
                fontFamily: Fonts.FunnelMedium,
                fontSize: 12,
                color: Colors.black,
              },
            ]}
          >
            {email
              ? `If an account exists for   ${email}, a password reset link has been sent. Please tap the link in that email to create a new password.`
              : "If an account exists for your email, a password reset link has been sent."}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("SignIn" as any)}
          >
            <Text style={styles.backToSignInLink}>Back to Log In</Text>
          </TouchableOpacity>
        </View>

        {toast.visible && (
          <CustomToast
            message={toast.message}
            borderColors={
              toast.type === "error"
                ? ["#EF4444", "#DC2626"]
                : ["#10B981", "#059669"]
            }
            onHide={() => setToast({ ...toast, visible: false })}
          />
        )}
      </KeyboardAvoidingView>
    </>
  );
};

export default CheckEmail;
