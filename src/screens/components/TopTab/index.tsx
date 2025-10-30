import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Title from "../../../components/text/Title";
import { Colors } from "../../../constant/Colors";
import { Fonts } from "../../../constant/Fonts";
import tw from "../../../lib/tailwind";

interface TopTabProps {
  onTabChange?: (tab: string) => void;
}

const tabs = ["Home", "Active", "Pending", "Completed" ];

const TopTab: React.FC<TopTabProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("Active");

  const handlePress = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <View style={tw` flex-row justify-between items-center`}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.8}
            onPress={() => handlePress(tab)}
            style={tw`mx-1`}
          >
            {isActive ? (
              <LinearGradient
                colors={["#FF094E", "#F5444E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={tw` w-[87px] h-[27px] rounded-[13.67px] justify-center items-center p-[1px]`}
              >
                <View
                  style={tw` flex-1 w-full h-full bg-white rounded-[13.67px] justify-center items-center`}
                >
                  <Title
                    text={tab}
                    color={Colors.activeText}
                    font={Fonts.FunnelBold}
                    size={14}
                  />
                </View>
              </LinearGradient>
            ) : (
              <View
                style={tw`w-[87px] h-[27px] rounded-[13.67px] justify-center items-center bg-transparent`}
              >
                <Title
                  text={tab}
                  color={Colors.inactiveText}
                  font={Fonts.FunnelBold}
                  size={14}
                />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TopTab;
