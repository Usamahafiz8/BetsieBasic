import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../../components/Header';
import ProfileOption from '../../../components/ProfileOptions';
import { profileOptions } from '../../../constant/profileOptions';
import tw from '../../../lib/tailwind';
import ConfirmModal from '../../../components/ConfirmModal';
import { useBetsieStore } from '../../../store/useBetsieStore';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useBetsieStore();
  const handleNavigation = (route: string) => {
    if (route === 'Logout') {
      setShowLogoutModal(true);
    } else {
      navigation.navigate(route);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header
        title="Create New"
        onPress={() =>
          navigation.navigate('CreateBet', {
            screen: 'DefineBet',
          })
        }
      />
      <FlatList
        data={profileOptions}
        keyExtractor={item => item.label}
        renderItem={({ item }) => (
          <ProfileOption
            icon={item.icon}
            label={item.label}
            onPress={() => handleNavigation(item.route)}
            hasBorder={item.hasBorder !== false}
          />
        )}
        contentContainerStyle={tw`px-6`}
      />
      <ConfirmModal
        visible={showLogoutModal}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
