import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Title from "../../../components/text/Title";
import { Colors } from "../../../constant/Colors";
import { Fonts } from "../../../constant/Fonts";
import tw from "../../../lib/tailwind";

interface TopTabProps {
  onTabChange?: (tab: string) => void;
}

const tabs = ["Friends",  "Public"];

const MyHomeToptab: React.FC<TopTabProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("Friends");

  const handlePress = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <View style={tw`flex-row justify-between items-center w-full`}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <TouchableOpacity
            key={tab}
            style={tw`flex-1 justify-center`}
            activeOpacity={0.8}
            onPress={() => handlePress(tab)}
          >
            <View
              style={[
                tw`py-1 rounded-full items-center`,
                isActive
                  ? tw`border-2 border-primary`
                  : tw`bg-transparent border border-transparent`,
              ]}
            >
              <Title
                text={tab}
                color={isActive ? Colors.activeText : Colors.inactiveText}
                font={Fonts.FunnelBold}
                size={14}
                style={tw`text-center`}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MyHomeToptab;
