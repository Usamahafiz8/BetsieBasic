import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
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
import type {ChangePasswordprops } from '../../../utils/types';
import CustomToast from '../../../components/CustomToast';
import { useApiRequest } from '../../../api/useApiRequest';
import { useBetsieStore } from '../../../store/useBetsieStore';
import PasswordValidation from '../../../components/PasswordValidation';
import Header from '../../../components/Header';



type ToastState = { message: string; type: 'error' | 'success' } | null;

const ChangePassword: React.FC<ChangePasswordprops> = () => {
  const apiRequest = useApiRequest();
  const navigation = useNavigation<ChangePasswordprops['navigation']>();
  const [email, setEmail] = useState<string>('');
  const [toast, setToast] = useState<ToastState>(null);
  const [password, setPassword] = useState<string>('');
  const setUser = useBetsieStore(state => state.setUser);
  const [loading, setLoading] = useState<boolean>(false);
  const setTokens = useBetsieStore(state => state.setTokens);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const handleChangePassword = async () => {
    // 1️⃣ Validations
    if (!email || !password || !confirmPassword) {
      setToast({ message: "All fields are required.", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }
    if (!termsAccepted) {
      setToast({ message: "You must accept Terms & Privacy Policy.", type: "error" });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const payload = {
        userType: "Email",
        email,
        password,
      };

      // --- Debug log for payload ---
      console.log("🐛 Debug: Signup Payload:", payload);

      const response: any = await apiRequest(END_POINTS.REGISTER, payload);

      // --- Debug log for full API response ---
      console.log("🐛 Debug: Full API response object:", response);

      if (response?.success) {
        console.log("🔍 DEBUG: Signup successful, about to navigate");
        console.log("🔍 DEBUG: Response data:", response.data);
        console.log("🔍 DEBUG: User before setUser:", useBetsieStore.getState().user);

        // Handle success case - DON'T set user yet
        await setTokens(response.tokens.accessToken, response.tokens.refreshToken);
        console.log("🔍 DEBUG: Tokens set, about to navigate to CreateUserName");

        setToast({ message: "Signup successful!", type: "success" });

        // Navigate to CreateUserName
        console.log("🔍 DEBUG: Navigating to CreateUserName with params:", {
          email: response?.data?.email || email,
          id: response?.data?.id
        });

        navigation.navigate("SignIn", {
          email: response?.data?.email || email,
          id: response?.data?.id
        });


        console.log("🔍 DEBUG: Navigation call completed");
      } else {
        console.log("🔍 DEBUG: Signup failed:", response?.message);
        setToast({ message: response?.message || "Signup failed. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error("❌ Signup API Error:", error);
      setToast({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
       <Header />

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
      

      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <Content text="Change your Password" style={styles.title} />
        <View style={styles.inputGroup}>
        
          <InputField
            label="New Password"
            icon={Images.pwlock}
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          <InputField
            label="Confirm New Password"
            icon={Images.pwlock}
            isPassword
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <PasswordValidation password={password} />

        <Button onPress={handleChangePassword} title="Change Password" />
    

        <TouchableOpacity onPress={() => navigation.navigate('SignIn' as any)}>
          <Text style={styles.backToSignInLink}>Back to Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
