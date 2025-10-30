import React, { useState, useCallback, useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Images from "../../../constant/Images";
import tw from "../../../lib/tailwind";
import Tooltip from "../../../components/ToolTip";
import DecisionMethodCard from "../../../screens/components/DecisionMethodCard";

type CreateStackParamList = {
  CreateBet: undefined;
  DefineBet: { method: string };
};
type NavigationProp = NativeStackNavigationProp<CreateStackParamList, "CreateBet">;

const CreateBet = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ x: number; y: number } | null>(null);

  type TouchableOpacityRef = React.ElementRef<typeof TouchableOpacity>;
  const buttonRefs = useRef<{ [key: number]: TouchableOpacityRef | null }>({});

  const decisionMethods = [
    { id: 1, title: "Consensus", image: Images.consensus2, description: "Participants vote on the winner. If votes match, the bet is resolved." },
    { id: 2, title: "Moderator", image: Images.moderator1, description: "A designated moderator makes the final decision on bet outcomes." },
    { id: 3, title: "Ask The Robots", image: Images.ask_the_robots, description: "AI-powered system analyzes the bet and determines the winner automatically." },
    { id: 4, title: "Crowd-Sourced", image: Images.crowdsourced, description: "Multiple participants contribute to the decision-making process." },
  ];

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);
      return () => setIsVisible(false);
    }, [])
  );

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => navigation.goBack(), 300);
  };

  const handleInfoPress = (id: number) => {
    if (activeTooltip === id) {
      setActiveTooltip(null);
      return;
    }

    const ref = buttonRefs.current[id];
    if (ref) {
      ref.measure((x, y, width, height, pageX, pageY) => {
        setAnchorPosition({ x: pageX + width / 2 - 100, y: pageY - 80 });
        setActiveTooltip(id);
      });
    }
  };

  const handleCardPress = (id: number) => {
    if (id !== 1) return; // Only allow "Consensus" to be clickable
    navigation.navigate("DefineBet", { method: "Random Number" });
  };

  const renderCard = ({ item }: { item: any }) => {
    const isActive = activeTooltip === item.id;

    return (
      <View
        style={[
          tw`flex-1 m-2 relative rounded-xl border border-white`,
          item.id !== 1 ? { opacity: 0.4, pointerEvents: "none" } : {}, // blur and disable other 3 cards
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={tw`rounded-xl overflow-hidden`}
          onPress={() => handleCardPress(item.id)}
          disabled={item.id !== 1}
        >
          <DecisionMethodCard title={item.title} image={item.image} />
        </TouchableOpacity>

        {!isActive && (
          <View style={tw`absolute top-2 right-2`}>
            <TouchableOpacity
              ref={(el) => {
                buttonRefs.current[item.id] = el;
              }}
              onPress={() => handleInfoPress(item.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF094E", "#F5444E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={tw`rounded-full p-[1px]`}
              >
                <View style={tw`bg-white w-4 h-4 rounded-full items-center justify-center`}>
                  <Text style={tw`text-[#F5444E] font-bold`}>i</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <Tooltip
          visible={isActive}
          title={item.title}
          description={item.description}
          onClose={() => setActiveTooltip(null)}
          anchorPosition={anchorPosition ?? undefined}
          autoHideMs={5000}
        />
      </View>
    );
  };

  return (
    <View style={tw`flex-1`}>
      <Modal
        isVisible={isVisible}
        onBackdropPress={handleClose}
        backdropOpacity={0.8}
        backdropColor="#000"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver
        style={tw`m-0 justify-end`}
      >
        <View style={tw`h-1/2.6 max-h-[80%] p-0 rounded-t-2xl`}>
          <FlatList
            data={decisionMethods}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            numColumns={2}
            columnWrapperStyle={tw`justify-between`}
            contentContainerStyle={tw`pb-4`}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
};

export default CreateBet;
