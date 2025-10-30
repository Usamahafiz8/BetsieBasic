import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../../components/Button';
import GradientText from '../../../components/GradientText';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import Loader from '../../../components/Loader';
import LoginButton from '../../../components/LoginButton';
import Separator from '../../../components/Separator';
import tw from '../../../lib/tailwind';
import {  googleSignIn } from '../../../utils/authHelpers';
import Images from '../../../constant/Images';
import { useApiRequest } from '../../../api/useApiRequest';
import { END_POINTS } from '../../../api/END_POINTS';
import {useBetsieStore } from '../../../store/useBetsieStore';

type RootStackParamList = {
  Home: undefined;
  AccountCreation: undefined;
  ResetPassword: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const SignIn: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { loading, loginWithProvider, hasLoggedOut, saveAuthData } =
    useBetsieStore(state => state);
  const apiRequest = useApiRequest();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hasLoggedOut) {
      useBetsieStore.setState({ hasLoggedOut: false });
    }
  }, [hasLoggedOut]);

  const handleSignIn = async () => {
    // Simulate sign-in validation
    if (!email || !password) {
      setErrorMessage(
        'The username, email, or password you entered is incorrect. Please try again.',
      );
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const res = await apiRequest(END_POINTS.LOGIN, {
        email,
        password,
      });
      console.log('🚀 ~ handleSignIn ~ res:', res);

      if (!res?.token) {
        throw new Error(res?.message || 'Invalid credentials');
      }

      await saveAuthData(res.token, res.user);

      setIsLoading(false);
    } catch (err) {
      setErrorMessage('The username, email, or password is incorrect.');
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const { idToken } = await googleSignIn();
      await loginWithProvider('google', idToken);
    } catch (err) {
      Alert.alert('Google Sign-In Failed', String(err));
    }
  };

  // const handleFacebook = async () => {
  //   try {
  //     const { token: fbToken } = await facebookSignIn();
  //     await loginWithProvider('facebook', fbToken);
  //   } catch (err) {
  //     Alert.alert('Facebook Sign-In Failed', String(err));
  //   }
  // };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple login
    console.log('Apple Sign In');
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {loading && <Loader />}
      <Header
        title="Create Account"
        onPress={() => navigation.navigate('AccountCreation')}
      />

      <View style={tw`flex-1 px-6`}>
        <Text style={tw`text-xl font-semibold text-center my-6`}>Log In</Text>

        <View style={tw`gap-4`}>
          <InputField
            label="Username or Email"
            icon={Images.email}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Password"
            icon={Images.pwlock}
            isPassword
            value={password}
            onChangeText={setPassword}
          />

          {errorMessage !== '' && (
            <GradientText
              style={tw`font-regular text-xs mb-2`}
              text={errorMessage}
            />
          )}

          <Button title="Log In" onPress={handleSignIn} loading={isLoading} />
        </View>

        <TouchableOpacity
          style={tw`items-center py-6`}
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={tw`font-regular underline text-lg`}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <Separator />

        <Text style={tw`text-center font-regular mb-4 text-lg`}>
          Log In with
        </Text>

        <View style={tw`flex-row mb-6`}>
          <LoginButton
            title="Apple"
            icon={Images.apple}
            onPress={() => console.log('Apple sign in')}
          />

          <LoginButton
            title="Google"
            icon={Images.google}
            onPress={handleGoogle}
          />

          <LoginButton
            title="Facebook"
            icon={Images.facebook}
            // onPress={handleFacebook}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
