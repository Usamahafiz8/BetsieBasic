import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import tw from '../../lib/tailwind';

interface ProfileOptionProps {
  icon: ImageSourcePropType;
  label: string;
  onPress: () => void;
  hasBorder?: boolean;
  rightElement?: React.ReactNode; // for account detail
}

const ProfileOption: React.FC<ProfileOptionProps> = ({
  icon,
  label,
  onPress,
  hasBorder = true,
  rightElement,
}) => {
  const isButtonMode = Boolean(rightElement);

  const RowContent = () => (
    <View style={tw`flex-row items-center justify-between py-6`}>
      {/* Left side */}
      <View style={tw`flex-row items-center`}>
        <Image source={icon} style={tw`w-6 h-6 mr-4`} resizeMode="contain" />
        <Text style={tw`font-regular text-base`}>{label}</Text>
      </View>

       {/* Right side (only if provided) */}
      {isButtonMode && <View>{rightElement}</View>}
    </View>
  );
  return (
    <>
    {!isButtonMode ? (
        <TouchableOpacity
          onPress={onPress}
          style={tw`flex-row items-center justify-between`}
          activeOpacity={0.7}
        >
          <RowContent />
        </TouchableOpacity>
      ) : (
        <RowContent />
      )}

      {hasBorder && (
        <LinearGradient
          colors={['#FF094E', '#F5444E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={tw`h-[3px]`}
        />
      )}
    </>
  );
};

export default ProfileOption;
