import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../../components/Button';
import Header from '../../../components/Header';
import InputField from '../../../components/InputField';
import tw from '../../../lib/tailwind';
import Images from '../../../constant/Images';
import { useBetsieStore } from '../../../store/useBetsieStore';
import { baseUrl } from '../../../api/baseUrl';

const ChangeUsername = () => {
  const navigation = useNavigation();
  const { user, setUser, token } = useBetsieStore();
  const oldUsername = user?.playerName;
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const body: any = {
        oldPlayerName: oldUsername ? oldUsername : null,
        newPlayerName: newUsername,
      };
      console.log('🚀 ~ handleSave ~ body:', body);

      // Only send password if account type is Email
      if (user?.userType === 'Email') {
        body.password = password;
      } else {
        body.password = null;
      }

      const res = await fetch(
        `${baseUrl}/users/${user?.id}/player-name/secure`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );
      console.log('🚀 ~ handleSave ~ res:', res);

      if (!res.ok) throw new Error('Failed to update username');
      const data = await res.json();
      console.log('🚀 ~ handleSave ~ data:', data);

      const updatedUser = { ...user, playerName: data.playerName };
      setUser(updatedUser);

      navigation.navigate('UpdateSuccess', {
        title: 'Username Updated',
        subTitle: 'Your new username is now active.',
      });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
    setIsLoading(false);
  };

  const isSocialLogin = user?.userType !== 'Email';

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      <View style={tw`px-6 gap-4`}>
        <Text style={tw`font-semibold text-lg text-center py-4`}>
          Change Your Username
        </Text>

        <InputField
          label="Current Username"
          icon={Images.at}
          value={oldUsername}
          editable={false}
          iconColor="black"
        />

        <Text style={tw`font-regular text-xs`}>
          Usernames are public facing. Must be 3-20 characters long. No special
          characters or spaces. Don’t use your real name.
        </Text>
        <InputField
          label="New Username"
          icon={Images.at}
          value={newUsername}
          onChangeText={setNewUsername}
          iconColor="black"
        />

        {/* Only ask password if user signed up with Email */}
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
          title="Save New Username"
          onPress={handleSave}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangeUsername;
