import { StyleSheet } from 'react-native';

import { Colors } from '../../constant/Colors';
import { Fonts } from '../../constant/Fonts';
import tw from '../../lib/tailwind';

export const MainHeaderStyles = StyleSheet.create({
  container: tw`
    w-full
    h-40
    bg-white
    border-b-[1px]
    border-borders
    flex-row
    items-center
    justify-between
    px-4
  `,
  leftContent: tw`
    flex-row 
    items-center
    gap-2
  `,
  rightContent: tw`
    p-2
  `,
  placeholder: tw`w-12`, // Matches the width of the left side to center the title
  
  backIcon: tw`
    w-6 
    h-6
  `,
  backText: tw`
    text-base 
    text-gray-800
  `,
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    // color: Colors.gray900,
  },
  actionIcon: tw`
    w-6
    h-6
  `,
});