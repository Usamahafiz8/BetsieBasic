import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';
import tw from '../../../lib/tailwind';
import Images from '../../../constant/Images';
import CheckBox from '../../../components/CheckBox';
import Loader from '../../../constant/Loader';
import Button from '../../../components/Button';
import { END_POINTS } from '../../../api/END_POINTS';
import Content from '../../../components/text/Content';
import InputField from '../../../components/InputField';
import type { SignupEmailProps } from '../../../utils/types';
import CustomToast from '../../../components/CustomToast';
import { useApiRequest } from '../../../api/useApiRequest';
import { useBetsieStore } from '../../../store/useBetsieStore';
import PasswordValidation from '../../../components/PasswordValidation';
import Header from '../../../components/Header';

type ToastState = { message: string; type: 'error' | 'success' } | null;

const SignupEmail: React.FC<SignupEmailProps> = () => {
  const apiRequest = useApiRequest();
  const { saveAuthData } = useBetsieStore(state => state);
  const navigation = useNavigation<SignupEmailProps['navigation']>();
  const [email, setEmail] = useState<string>('');
  const [toast, setToast] = useState<ToastState>(null);
  const [password, setPassword] = useState<string>('');
  const setUser = useBetsieStore(state => state.setUser);
  const [loading, setLoading] = useState<boolean>(false);
  const setTokens = useBetsieStore(state => state.setTokens);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // const handleSignup = async () => {
  //   // 1️⃣ Validations
  //   if (!email || !password || !confirmPassword) {
  //     setToast({ message: "All fields are required.", type: "error" });
  //     return;
  //   }
  //   if (password !== confirmPassword) {
  //     setToast({ message: "Passwords do not match.", type: "error" });
  //     return;
  //   }
  //   if (!termsAccepted) {
  //     setToast({ message: "You must accept Terms & Privacy Policy.", type: "error" });
  //     return;
  //   }

  //   setLoading(true);
  //   setToast(null);

  //   try {
  //     const payload = {
  //       userType: "Email",
  //       email,
  //       password,
  //     };

  //     // --- Debug log for payload ---
  //     // console.log("🐛 Debug: Signup Payload:", payload);

  //     const response: any = await apiRequest(END_POINTS.REGISTER, payload);

  //     // --- Debug log for full API response ---
  //     console.log("🐛 Debug: Full API response object:", response);

  //     if (response?.success) {
  //       // console.log("🔍 DEBUG: Signup successful, about to navigate");
  //       console.log("🔍 DEBUG: Response data:", response.data);
  //       console.log("🔍 DEBUG: User before setUser:", useBetsieStore.getState().user);

  //       // Handle success case - DON'T set user yet
  //       await setTokens(response.tokens.accessToken, response.tokens.refreshToken);
  //       console.log("🔍 DEBUG: Tokens set, about to navigate to CreateUserName");

  //       setToast({ message: "Signup successful!", type: "success" });

  //       // Navigate to CreateUserName
  //       console.log("🔍 DEBUG: Navigating to CreateUserName with params:", {
  //         email: response?.data?.email || email,
  //         id: response?.data?.id
  //       });

  //       navigation.navigate("CreateUserName", {
  //         email: response?.data?.email || email,
  //         id: response?.data?.id
  //       });

  //       console.log("🔍 DEBUG: Navigation call completed");
  //     } else {
  //       console.log("🔍 DEBUG: Signup failed:", response?.message);
  //       setToast({ message: response?.message || "Signup failed. Please try again.", type: "error" });
  //     }
  //   } catch (error) {
  //     console.error("❌ Signup API Error:", error);
  //     setToast({
  //       message: "An unexpected error occurred. Please try again.",
  //       type: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignup = async () => {
    // ✅ Basic validations
    if (!email || !password || !confirmPassword) {
      setToast({ message: 'All fields are required.', type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match.', type: 'error' });
      return;
    }

    if (!termsAccepted) {
      setToast({
        message: 'You must accept Terms & Privacy Policy.',
        type: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      setToast(null);

      const payload = {
        userType: 'Email',
        email,
        password,
      };

      const res = await apiRequest(END_POINTS.REGISTER, payload);
      console.log('🚀 ~ handleSignup ~ res:', res);

      if (!res?.tokens?.accessToken) {
        throw new Error(res?.message || 'Signup failed');
      }

      // ✅ Save token + user (same as in login)
      // await saveAuthData(res.tokens.accessToken, res.data);

      // ✅ Navigate to CreateUserName screen
      navigation.navigate('CreateUserName', {
        email: res?.data?.email || email,
        id: res?.data?.id,
        token: res?.tokens?.accessToken,
      });

      setLoading(false);
    } catch (err: any) {
      console.error('❌ Signup Error:', err);
      setToast({
        message: 'An unexpected error occurred. Please try again.',
        type: 'error',
      });
      setLoading(false);
    }
  };

  const handleTermsOfServicePress = () => {
    navigation.navigate('TermsOfService');
  };

  const handlePrivacyPolicyPress = () => {
    navigation.navigate('PrivacyPolicy');
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Loader />}
      {toast && (
        <CustomToast
          message={toast.message}
          borderColors={
            toast.type === 'error'
              ? ['#EF4444', '#DC2626']
              : ['#10B981', '#059669']
          }
          onHide={() => setToast(null)}
        />
      )}

      <Header showBack onPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <Content text="Create Account With Email" style={styles.title} />
        <View style={styles.inputGroup}>
          <InputField
            label="Email Address"
            icon={Images.email}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <InputField
            label="Password"
            icon={Images.pwlock}
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          <InputField
            label="Confirm Password"
            icon={Images.pwlock}
            isPassword
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <PasswordValidation password={password} />

        <Button onPress={handleSignup} title="Create Account" />


 {/* <View style={tw`bg-green500  mt-4`}> */}
  <View style={tw`  flex-row items-center mt-6` }>
    {/* Custom Checkbox */}
    <CheckBox
      checked={termsAccepted}
      onChange={() => setTermsAccepted(!termsAccepted)}
    />
    {/* Text with clickable links */}
    <Text style={tw`ml-1  text-black text-[12px] flex-wrap`}>
      I confirm that I have read and agree
      <Text
        style={tw`text-black text-sm underline font-semibold`}
        onPress={handleTermsOfServicePress}
      >
        Terms of Service

        
      </Text>{' '}
      and
    </Text>
  </View>
  
  <View style={tw`items-center`}>
  <Pressable onPress={handlePrivacyPolicyPress}>
    <Text style={tw` px-1 py-1 text-black text-sm underline font-semibold rounded-lg`}>
      Privacy Policy
    </Text>
  </Pressable>
</View>
'
{/* </View> */}
<View style={tw`mt-4 items-center`}>
  <Pressable
    onPress={() => navigation.navigate('SignIn' as any)}
    style={tw` px-1 py-1 rounded-lg`}
  >
    <Text style={[tw`text-white text-sm font-semibold`, styles.backToSignInLink]}>
      Back to Log In
    </Text>
  </Pressable>
</View>







      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupEmail;