import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DecisionMethodCard from '../../components/DecisionMethodCard';
import Header from '../../../components/Header';
import Images from '../../../constant/Images';
import tw from '../../../lib/tailwind';
import Button from '../../../components/Button';

const ChooseDecisionMethod = ({ route }) => {
  const navigation = useNavigation();
  const { receiver, description, visibility, expiresAt, headToHead } = route.params;
  const [resolutionMethod, setResolutionMethod] = useState<string>('consensus');
  const [selected, setSelected] = useState<number>();
  const decisionMethods = [
    { id: 1, title: 'Consensus', image: Images.consensus2, value: 'consensus' },
    { id: 2, title: 'Moderator', image: Images.moderator1, value: 'moderator' },
    {
      id: 3,
      title: 'Ask The Robots',
      image: Images.ask_the_robots,
      value: 'ask_the_robots',
    },
    {
      id: 4,
      title: 'Crowd-Sourced',
      image: Images.crowdsourced,
      value: 'crowd_sourced',
    },
  ];

  const renderCard = ({ item }: { item: any }) => {
    const isDisabled = item.id !== 1;
    return (
      <View style={tw`flex-1 m-2`}>
        <TouchableOpacity
          disabled={isDisabled}
          onPress={() => {
            setResolutionMethod(item.value);
            setSelected(item.id);
          }}
        >
          <DecisionMethodCard
            id={item.id}
            title={item.title}
            image={item.image}
            disabled={isDisabled}
            selected={selected}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handleNext = () => {
    navigation.navigate('BetReview', {
      receiver,
      description,
      visibility,
      expiresAt,
      resolutionMethod,
      headToHead,
    });
  };

  return (
   <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      <View style={tw`p-2`}>
        <Text style={tw`text-lg font-semibold text-center py-2`}>
          Start Your Bet
        </Text>
        <Text style={tw`text-base font-semibold text-center text-black mb-6`}>
          Choose your decision method
        </Text>
        <FlatList
          data={decisionMethods}
          keyExtractor={item => item.id.toString()}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={tw`justify-between`}
          contentContainerStyle={tw`pb-4`}
          showsVerticalScrollIndicator={false}
        />

        <Button
          title="Next >"
          onPress={handleNext}
          containerStyle={tw`self-center w-auto`}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChooseDecisionMethod;
