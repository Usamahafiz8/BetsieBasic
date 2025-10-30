import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../../components/Button';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import tw from '../../../lib/tailwind';
import Images from '../../../constant/Images';
import { useBetsieStore } from '../../../store/useBetsieStore';
import { baseUrl } from '../../../api/baseUrl';

const ChangeEmail = () => {
  const navigation = useNavigation();
  const { user, setUser, token } =  useBetsieStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleUpdateEmail = async () => {
    try {
      const body: any = { email, userType: user?.userType };
      if (user?.userType === 'Email') {
        body.password = password;
      }

      const res = await fetch(`${baseUrl}/users/${user?.id}/updateEmail`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to update email');
      const data = await res.json();
      console.log('🚀 ~ handleUpdateEmail ~  data:', data);
      const updatedUser = { ...user, email: data.user.email };
      setUser(updatedUser);

      navigation.navigate('UpdateSuccess', {
        icon: Images.email,
        title: 'Update Your Email',
        subTitle: `We've sent a verification link to ${email}. Please tap the link in that email to finish updating your account.`,
      });
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  const isSocialLogin = user?.userType !== 'Email';

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      <Text style={tw`font-semibold text-lg text-center py-4`}>
        Update Your Email
      </Text>
      <Text style={tw`font-regular text-xs text-center pb-4`}>
        Enter your new email address below. We will send a verification link to
        confirm the change.
      </Text>
      <View style={tw`px-6 gap-4`}>
        <InputField
          label="New Email Address"
          icon={Images.email}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {!isSocialLogin && (
          <InputField
            label="Confirm Your Password"
            icon={Images.pwlock}
            isPassword
            value={password}
            onChangeText={setPassword}
          />
        )}
        <Button
          title="Update Email"
          onPress={handleUpdateEmail}
          // onPress={() =>
          //   navigation.navigate('UpdateSuccess', {
          //     icon: Images.email, // optional
          //     title: 'Update Your Email',
          //     subTitle:
          //       "We've sent a verification link to [user's new email]. Please tap the link in that email to finish updating your account.",
          //   })
          // }
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangeEmail;
