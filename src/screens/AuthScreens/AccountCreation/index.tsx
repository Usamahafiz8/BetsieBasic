import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import Button from '../../../components/Button';
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import LoginButton from '../../../components/LoginButton';
import Separator from '../../../components/Separator';
import tw from '../../../lib/tailwind';
import {  googleSignIn } from '../../../utils/authHelpers';
import Images from '../../../constant/Images';
import { useBetsieStore } from '../../../store/useBetsieStore';

const AccountCreation: React.FC = () => {
  const navigation = useNavigation<any>();
  const { loading, loginWithProvider, setUser } = useBetsieStore(
    state => state,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleAppleSignUp = async () => {
    try {
      setIsLoading(true);
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }
      console.log('Apple response:', appleAuthRequestResponse);
      const { identityToken } = appleAuthRequestResponse;
      await loginWithProvider('apple', identityToken);
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('User canceled Apple Sign-In.');
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignin = async () => {
    try {
      setIsLoading(true);
      const googleUser = await googleSignIn();
      if (!googleUser || !('idToken' in googleUser)) {
        throw new Error(
          'Google Sign-In did not return a valid user with idToken',
        );
      }
      const { idToken } = googleUser as { idToken: string };
      await loginWithProvider('google', idToken);
    } catch (err) {
      Alert.alert('Google Sign-In Failed', String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebook = async () => {
    // try {
    //   setIsLoading(true);
    //   const result = await facebookSignIn();
    //   await loginWithProvider('facebook', result.token);
    // } catch (err) {
    //   Alert.alert('Facebook Sign-In Failed', String(err));
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {(loading || isLoading) && <Loader />}
      <Header title="Log In" onPress={() => navigation.navigate('SignIn')} />

      <View style={tw`flex-1 px-6`}>
        <Text style={tw`text-xl font-semibold text-center my-6`}>
          Create Your Account
        </Text>

        <Text style={tw`text-center font-regular mb-2 text-lg`}>
          Sign Up with
        </Text>

        <View style={tw`flex-row mb-6`}>
          <LoginButton
            title="Apple"
            icon={Images.apple}
            onPress={handleAppleSignUp}
          />

          <LoginButton
            title="Google"
            icon={Images.google}
            onPress={handleGoogleSignin}
          />

          <LoginButton
            title="Facebook"
            icon={Images.facebook}
            onPress={handleFacebook}
          />
        </View>

        <Separator />

        <Button
          title="Sign up with Email"
          onPress={() => navigation.navigate('SignupEmail')}
        />
      </View>
    </SafeAreaView>
  );
};

export default AccountCreation;
