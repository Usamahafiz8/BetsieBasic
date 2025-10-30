import React from "react";
import { Image,ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from "../../../components/Button";
import Header from "../../../components/Header";
import InfoRow from "../../../components/InfoRow";
import ProfileCard from "../../../components/ProfileCard";
import Images from "../../../constant/Images";
import tw from '../../../lib/tailwind';

const ExecuteBetResolutionScreen = () => {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 bg-white`}>
        <Header title="Active Bet" />
        <ScrollView contentContainerStyle={tw`px-5 pb-10`}>
          <View style={tw`flex-row justify-between mt-4 ml-10 mr-10`}>
            <ProfileCard name="Real Name" image={Images.profile} />
            <ProfileCard name="Real Name" image={Images.profile} />
          </View>

          <View style={tw`relative mt-6`}>
          
            <Button
              containerStyle={tw`flex-row w-28 h-8 self-end items-center justify-center mr-8 `}
              textStyle={tw`text-sm fontFamily-regular`}
              title="Inbox (1)"
              variant="filled"
              icon={Images.comment}
              iconPosition="left"
              onPress={() => console.log('Next pressed')}  />
          
            <View style={tw`absolute top-[-4px] right-[24px] bg-black rounded-full w-4 h-4 justify-center items-center`}>
              <Text style={tw`text-xs text-white justify-center items-center`}>1</Text>
            </View>
          </View>

          <View style={tw`flex-row justify-between mt-4`}>
            <View style={tw`flex-col items-center w-1/2 pr-2`}>
              <Text style={tw`font-bold text-lg mb-2`}>Bets Ends on</Text>
              <InfoRow
                icon={<Images.calendar width={24} height={24} />}
                value="July 24, 2025 | 9:00 AM"
              />
            </View>
            <View style={tw`flex-col items-center w-1/2 pl-2`}>
              <Text style={tw`font-bold text-lg mb-2`}>Decision Method</Text>
              <InfoRow
                icon={<Images.consensus width={24} height={24} />}
                action="Consensus"
                onActionPress={() => console.log("Consensus")}
              />
            </View>
          </View>

          <View style={tw`mt-6`}>
            <Text style={tw`text-black font-semibold`}>Description</Text>
            <Text style={tw`text-black mt-2 text-sm leading-6`}>
              Detail of Bet, the event or some thing on which this bet is placed Detail of Bet, the event or some thing on which this bet is placed. Detail of Bet, the event or some thing on which this bet is placed Detail of Bet, the event or some thing on which this bet is placed.
            </Text>
          </View>

          <Text style={tw`text-black font-semibold`}>Who Won ?</Text>

          <View style={tw`flex-row justify-between mt-4 mb-4`}>
            <Button
              containerStyle={tw`w-28 h-9`}
              textStyle={tw` text-sm`}
              title="I Won"
              variant="outlined"
            />
            <Button
              containerStyle={tw`w-28 h-9`}
              textStyle={tw` text-sm`}
              title="Name Won"
              variant="outlined"
            />
            <Button
              containerStyle={tw`w-28 h-9`}
              textStyle={tw` text-sm`}
              title="It’s a Draw"
              variant="outlined"
            />
          </View>
          
          <Text style={tw`text-black mt-2 text-sm mb-4`}>
            Select one from these to continue.
          </Text>

          <Button
            title="Submit My Vote"
            variant="filled"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ExecuteBetResolutionScreen;