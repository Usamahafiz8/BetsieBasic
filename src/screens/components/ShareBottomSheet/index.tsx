// src/components/ShareBottomSheet.tsx
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import tw from "../../../lib/tailwind";
import Images from "../../../constant/Images";

// ✅ Ref type for parent control
export type ShareBottomSheetRef = {
  snapToIndex: (index: number) => void;
  close: () => void;
};

type ShareOption = {
  id: string;
  name: string;
  icon: any;
  color: string;
};

const SHARE_OPTIONS: ShareOption[] = [
  { id: "1", name: "Instagram", icon: Images.insta, color: "#111F42" },
  { id: "2", name: "Twitter", icon: Images.twitter, color: "#111F42" },
  { id: "3", name: "Facebook", icon: Images.fbicon, color: "#111F42" },
  { id: "4", name: "Tiktok", icon: Images.tiktok, color: "#000000" },
  { id: "5", name: "Whatsapp", icon: Images.whatsapp, color: "#111F42" },
  { id: "6", name: "Discord", icon: Images.discord, color: "#111F42" },
  { id: "7", name: "Reddit", icon: Images.reddit, color: "#111F42" },
  { id: "8", name: "Telegram", icon: Images.telegram, color: "#111F42" },
];

type Props = {
  snapPoints?: string[];
};

const ShareBottomSheet = forwardRef<ShareBottomSheetRef, Props>(
  ({ snapPoints = ["45%"] }, ref) => {
    const sheetRef = useRef<BottomSheet>(null);

    // ✅ Backdrop for dimming background
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.6}
        />
      ),
      []
    );

    // ✅ expose methods for parent
    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => {
        sheetRef.current?.snapToIndex(index);
      },
      close: () => {
        sheetRef.current?.close();
      },
    }));

    const renderItem = useCallback(({ item }: { item: ShareOption }) => {
      return (
        <TouchableOpacity style={tw`items-center m-2 w-18`}>
          <View
            style={[
              tw`w-12 h-12 rounded-full items-center justify-center mb-2`,
              { backgroundColor: item.color },
            ]}
          >
            <Image source={item.icon} resizeMode="contain" style={tw`w-6 h-6`} />
          </View>
          <Text style={tw`text-white text-xs text-center`}>{item.name}</Text>
        </TouchableOpacity>
      );
    }, []);

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={tw`bg-[#0E1326] rounded-t-2xl`}
        handleIndicatorStyle={tw`bg-[#555] w-10 self-center mt-2`}
      >
        <BottomSheetView style={tw`py-3 px-4`}>
          {/* Header Row */}
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <Text style={tw`text-white text-base font-semibold`}>Share</Text>
            <TouchableOpacity onPress={() => sheetRef.current?.close()}>
              <Text style={tw`text-white text-xl font-bold`}>X</Text>
            </TouchableOpacity>
          </View>

          {/* Share Options */}
          <FlatList
            data={SHARE_OPTIONS}
            keyExtractor={(item) => item.id}
            numColumns={4}
            renderItem={renderItem}
            contentContainerStyle={tw`items-center justify-center`}
          />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

ShareBottomSheet.displayName = "ShareBottomSheet";
export default ShareBottomSheet;
