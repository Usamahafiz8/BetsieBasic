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

const ChangePassword = () => {
  const navigation = useNavigation();
  const { user, token } = useBetsieStore();
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handlePasswordChange = async () => {
    if (!newPassword || !currentPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/users/${user?.id}/updatePassword`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userType: user?.userType,
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to update password');
      }

      navigation.navigate('UpdateSuccess', {
        title: 'Password Updated',
        subTitle: 'Your password has been successfully changed.',
      });
    } catch (err: any) {
      Alert.alert('Error', err.message.message || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      <Text style={tw`font-semibold text-lg text-center py-4`}>
        Change Your Password
      </Text>

      <View style={tw`px-6 gap-4`}>
        <InputField
          label="Current Password"
          icon={Images.pwlock}
          isPassword
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <InputField
          label="New Password"
          icon={Images.pwlock}
          isPassword
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <InputField
          label="Confirm New Password"
          icon={Images.pwlock}
          isPassword
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button title="Update Password" onPress={handlePasswordChange} />
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
