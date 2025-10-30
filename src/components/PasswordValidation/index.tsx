import React from "react";
import { View } from "react-native";
import tw from "../../lib/tailwind";
import CheckBox from "../CheckBox";

interface PasswordValidationProps {
  password: string;
}

const PasswordValidation: React.FC<PasswordValidationProps> = ({ password }) => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()]/.test(password);

  return (
    <View style={tw`  `}>
      <View style={tw`flex-row items-center `}>
        <CheckBox
          checked={hasMinLength}
          onChange={() => {}}
          label="At least 8 characters"
          containerStyle={tw``}
          boxStyle={tw`w-4 h-4`}
          labelStyle={tw`text-black text-[12px]`}
        />
      </View>

      <View style={tw`flex-row items-center `}>
        <CheckBox
          checked={hasUppercase}
          onChange={() => {}}
          label="At least 1 uppercase letter (A–Z)"
          containerStyle={tw``}
          boxStyle={tw`w-4 h-4`}
          labelStyle={tw`text-black text-[12px]`}
        />
      </View>

      <View style={tw`flex-row items-center `}>
        <CheckBox
          checked={hasLowercase}
          onChange={() => {}}
          label="At least 1 lowercase letter (a–z)"
          containerStyle={tw``}
          boxStyle={tw`w-4 h-4`}
          labelStyle={tw`text-black text-[12px]`}
        />
      </View>

      <View style={tw`flex-row items-center `}>
        <CheckBox
          checked={hasNumber}
          onChange={() => {}}
          label="At least 1 number (0–9)"
          containerStyle={tw``}
          boxStyle={tw`w-4 h-4`}
          labelStyle={tw`text-black text-[12px]`}
        />
      </View>

      <View style={tw`flex-row items-center mb-4`}>
        <CheckBox
          checked={hasSpecial}
          onChange={() => {}}
          label="At least 1 special character (e.g.!@#$%^&*)"
          containerStyle={tw``}
          boxStyle={tw`w-4 h-4`}
          labelStyle={tw`text-black text-[12px]`}
        />
      </View>
    </View>
  );
};

export default PasswordValidation;
