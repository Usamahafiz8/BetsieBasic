import React from 'react';
import { Image, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../../components/Button';
import Header from '../../../components/Header';
import tw from '../../../lib/tailwind';
import Images from '../../../constant/Images';

const UpdateSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { title, subTitle, icon } = route.params as {
    title: string;
    subTitle: string;
    icon?: any;
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header />

      <View style={tw`justify-center px-6 gap-4 flex-1`}>
        {icon && <Image source={Images.email} style={tw`w-16 h-16 mx-auto`} />}
        <Text style={tw`font-semibold text-lg text-center`}>{title}</Text>
        <Text style={tw`font-regular text-center text-sm`}>{subTitle}</Text>
        <Button
          title="Account Screen"
          onPress={() =>
            navigation.reset({
              index: 1, 
              routes: [
                { name: 'ProfileMain' }, 
                { name: 'AccountDetail' }, 
              ],
            })
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default UpdateSuccess;
