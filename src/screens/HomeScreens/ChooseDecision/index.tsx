import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

import Button from "../../../components/Button";
import Header from "../../../components/Header";
import InfoRow from "../../../components/InfoRow";
import ProfileCard from "../../../components/ProfileCard";
import Images from "../../../constant/Images";
import tw from "../../../lib/tailwind";

const ChooseDecision = () => {
  const route = useRoute();
  const { method } = route.params as { method: string };

  // methodConfig should allow PNG images
  const methodConfig: Record<
    string,
    { icon: number; label: string }
  > = {
    Consensus: {
      icon: Images.consensus2,
      label: "Consensus",
    },
    Moderator: {
      icon: Images.moderator1,
      label: "Moderator",
    },
    Robots: {
      icon: Images.ask_the_robots,
      label: "Ask The Robots",
    },
    Crowd: {
      icon: Images.crowdsourced,
      label: "Crowd-Sourced",
    },
  };


  const selected = methodConfig[method] || methodConfig["Consensus"];

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 bg-white`}>
        <Header title={`Decision: ${method}`} />
        <ScrollView contentContainerStyle={tw`px-5 pb-10`}>
          {/* Profile cards */}
          <View style={tw`flex-row justify-between mt-4 ml-10 mr-10`}>
            <ProfileCard name="Real Name" image={Images.profile} />
            <ProfileCard name="Real Name" image={Images.profile} />
          </View>

          {/* Inbox button */}
          <View style={tw`relative mt-6`}>
            <Button
              containerStyle={tw`flex-row w-28 h-8 self-end items-center justify-center mr-8`}
              textStyle={tw`text-sm fontFamily-regular`}
              title="Inbox (1)"
              variant="filled"
              icon={Images.comment}
              iconPosition="left"
              onPress={() => console.log("Inbox pressed")}
            />

            <View
              style={tw`absolute top-[-4px] right-[24px] bg-black rounded-full w-4 h-4 justify-center items-center`}
            >
              <Text style={tw`text-xs text-white`}>1</Text>
            </View>
          </View>

          {/* Bet info */}
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
                icon={selected.icon}
                action={selected.label}
                onActionPress={() => console.log(selected.label)}
              />
            </View>
          </View>

          {/* Description */}
          <View style={tw`mt-6`}>
            <Text style={tw`text-black font-semibold`}>Description</Text>
            <Text style={tw`text-black mt-2 text-sm leading-6`}>
              Detail of Bet, the event or some thing on which this bet is placed...
            </Text>
          </View>

          {/* Who Won */}
          <Text style={tw`text-black font-semibold mt-6`}>Who Won ?</Text>

          <View style={tw`flex-row justify-between mt-4 mb-4`}>
            <Button containerStyle={tw`w-28 h-9`} textStyle={tw`text-sm`} title="I Won" variant="outlined" />
            <Button containerStyle={tw`w-28 h-9`} textStyle={tw`text-sm`} title="Name Won" variant="outlined" />
            <Button containerStyle={tw`w-28 h-9`} textStyle={tw`text-sm`} title="It’s a Draw" variant="outlined" />
          </View>

          <Text style={tw`text-black mt-2 text-sm mb-4`}>
            Select one from these to continue.
          </Text>

          <Button title="Submit My Vote" variant="filled" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChooseDecision;
