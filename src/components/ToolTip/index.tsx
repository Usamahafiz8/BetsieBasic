import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Modal from "react-native-modal";
import tw from "../../lib/tailwind";

type TooltipProps = {
  visible: boolean;
  title: string;
  description: string;
  onClose?: () => void;
  autoHideMs?: number | null;
  // position of the button/card where tooltip should appear
  anchorPosition?: { x: number; y: number };
};

const Tooltip: React.FC<TooltipProps> = ({
  visible,
  title,
  description,
  onClose,
  autoHideMs = null,
  anchorPosition,
}) => {
  useEffect(() => {
    if (!visible || !autoHideMs) return;
    const id = setTimeout(() => onClose?.(), autoHideMs);
    return () => clearTimeout(id);
  }, [visible, autoHideMs, onClose]);

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={onClose}
      style={tw`m-0`}
    >
      {anchorPosition && (
        <View
          style={[
            tw`absolute items-center`,
            {
              top: anchorPosition.y - 50, // show above anchor (70px offset)
              left: anchorPosition.x - 65, // adjust to center horizontally
            },
          ]}
        >
          {/* Tooltip Box with Gradient Border */}
          <LinearGradient
            colors={["#FF094E", "#F5444E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`rounded-xl p-[1px]`}
          >
            <View style={tw`bg-white rounded-xl px-3 py-2 max-w-[180px]`}>
              <View style={tw`flex-row justify-between items-start`}>
                <Text style={tw`text-base font-bold text-black flex-1`}>
                  {title}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={tw`text-black text-lg font-bold`}>×</Text>
                </TouchableOpacity>
              </View>
              <Text style={tw`text-xs text-black `}>{description}</Text>
            </View>
          </LinearGradient>

          {/* Gradient Triangle Pointer */}
          <LinearGradient
            colors={["#FF094E", "#F5444E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`w-[6px] h-[12px] -mt-[1px] items-center justify-start rounded-b-lg`}
          >
            <View
              style={tw`w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-white`}
            />
          </LinearGradient>
        </View>
      )}
    </Modal>
  );
};

export default Tooltip;
