import React from "react";
import { Image,Text, View } from "react-native";

import tw from "../../lib/tailwind";

type ProfileCardProps = {
  name: string;
  image: any;
};
const ProfileCard = ({ name, image }: ProfileCardProps) => {
  return (
    <View style={tw`items-center `}>
      <Image
        source={image}
        style={tw`w-20 h-20 rounded-full border-2 border-gradientColor100`}
      />
      <Text style={tw`text-sm mt-4 font-semibold text-black`}>{name}</Text>
    </View>
  );
};
export default ProfileCard;