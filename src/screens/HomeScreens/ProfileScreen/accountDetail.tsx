import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import Header from '../../../components/Header';
import tw from '../../../lib/tailwind';
import Images from '../../../constant/Images';
import { AccountNavigationProp } from '../../../utils/types';
import { useBetsieStore } from '../../../store/useBetsieStore';
import { baseUrl } from '../../../api/baseUrl';

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  actionLabel?: string;
  onPress?: () => void;
  hasBorder?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  icon,
  label,
  actionLabel,
  onPress,
  hasBorder = true,
}) => {
  return (
    <>
      <View style={tw`flex-row items-center justify-between py-3 px-6`}>
        <View style={tw`flex-1 flex-row items-center`}>
          <Image
            source={icon}
            style={tw`w-6 h-6`}
            resizeMode="contain"
            tintColor={'#F5444E'}
          />
          <Text style={tw`ml-3 font-regular text-base flex-1`}>{label}</Text>
        </View>
        {actionLabel && (
          <TouchableOpacity onPress={onPress}>
            <LinearGradient
              colors={['#FF094E', '#F5444E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`p-[1px] rounded-md`}
            >
              <View
                style={tw`min-w-[100px] bg-white py-1 rounded-md items-center`}
              >
                <Text style={tw`font-regular text-sm`}>{actionLabel}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      {hasBorder && (
        <LinearGradient
          colors={['#FF094E', '#F5444E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={tw`h-[1px] my-3 mx-6`}
        />
      )}
    </>
  );
};
const AccountDetail: React.FC = () => {
  const navigation = useNavigation<AccountNavigationProp>();
  const { user, setUser, token } = useBetsieStore();
  const [imageUri, setImageUri] = useState<string | null>(user?.profilePicture ?? null);

  const updateProfilePicture = async (uri: string) => {
    try {
      const fileName = uri.split('/').pop() || 'profile.jpg';
      const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

      const formData = new FormData();
      formData.append('file', {
        uri,
        type: fileType,
        name: fileName,
      } as any);

      const res = await fetch(`${baseUrl}/users/${user?.id}/profile-picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      setImageUri(data.url);
      if (user) {
        const updatedUser = { ...user, profilePicture: data.url }
        setUser(updatedUser);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not upload picture');
    }
  };

  const handleImagePicked = async (result: any) => {
    if (result.assets && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      setImageUri(uri); // optimistic update
      await updateProfilePicture(uri);
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    handleImagePicked(result);
  };

  const takePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    });

    if (result.assets && result.assets[0]?.uri) {
      updateProfilePicture(result.assets[0].uri);
    }
  };
  // Show alert for options
  // const handleChangePhoto = () => {
  //   Alert.alert('Update Photo', 'Choose an option', [
  //     { text: 'Cancel', style: 'cancel' },
  //     { text: 'Gallery', onPress: pickImage },
  //     { text: 'Camera', onPress: takePhoto },
  //   ]);
  // };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      <View style={tw`items-center justify-center my-4`}>
        {/* Profile Image Wrapper */}
        <View style={tw`relative`}>
          {/* User Image */}
          <Image
            source={imageUri ? { uri: imageUri } : Images.avatar}
            style={tw`w-24 h-24 rounded-full border-2 border-red-500`}
          />

          {/* Camera Icon */}
          <TouchableOpacity
            style={tw`absolute -bottom-2 -right-2  w-10 h-10 rounded-full items-center justify-center`}
            onPress={pickImage}
          >
            <Image
              source={Images.camera}
              style={tw`w-6 h-6`}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <DetailRow
        icon={Images.at}
        label={user?.playerName}
        actionLabel="Update"
        onPress={() => navigation.navigate('ChangeUsername')}
      />
      <DetailRow
        icon={Images.email}
        label={user?.email}
        // actionLabel="Change"
        onPress={() => navigation.navigate('ChangeEmail')}
      />
      {user?.userType === 'Email' && (
        <DetailRow
          icon={Images.pwlock}
          label="********"
          actionLabel="Update"
          onPress={() => navigation.navigate('ChangePassword')}
        />
      )}
      <DetailRow
        icon={Images.history}
        label="Bet History Summary"
        actionLabel="View Details"
        onPress={() => navigation.navigate('BetHistory')}
      />
      <DetailRow
        icon={Images.friendlist}
        label="Friends List"
        actionLabel="View Friends"
        onPress={() => navigation.navigate('FriendList')}
        hasBorder={false}
      />
    </SafeAreaView>
  );
};

export default AccountDetail;
