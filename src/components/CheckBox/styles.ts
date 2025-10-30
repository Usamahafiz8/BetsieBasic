import { StyleSheet } from 'react-native';
import { Colors } from '../../constant/Colors';
import tw from '../../lib/tailwind';
export const checkboxStyles = StyleSheet.create({
  container: tw`flex-row items-center`,
  checkboxBase: tw`
    w-[16.63px] 
    h-[16.63px] 
    rounded-[3.69px]
    border-[1.23px]
    justify-center 
    items-center
  `,
  checkboxChecked: tw`bg-white border-black`,
  checkboxText: tw`ml-4 text-base text-black`,
  checkIcon: tw`text-black text-center mb-1 mr-1`,
});