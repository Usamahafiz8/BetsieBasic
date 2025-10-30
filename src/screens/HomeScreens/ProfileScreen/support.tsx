import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../../components/Header';
import tw from '../../../lib/tailwind';
import Images from '../../../constant/Images';

const Support = () => {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      <Text style={tw`font-semibold text-center text-base`}>
        Support / Contact Us
      </Text>
      <View style={tw`flex-1 justify-center items-center gap-3`}>
        <Image source={Images.support} style={tw`h-30 w-30`} resizeMode="contain" />
        <Text style={tw`font-semibold text-sm`}>Contact number </Text>
        <Text style={tw`font-semibold text-sm`}>Betsie@gmail.com</Text>
      </View>
    </SafeAreaView>
  );
};

export default Support;

const styles = StyleSheet.create({});
