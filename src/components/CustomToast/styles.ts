// src/styles/globalStyles.ts
import { StyleSheet } from 'react-native';

import { Colors } from '../../constant/Colors';
import tw from '../../lib/tailwind';

export const styles = StyleSheet.create({
  container: tw`mx-8 mt-20 rounded-2xl p-[1px]`,
  surface: tw` rounded-2xl bg-toasbgcolor shadow-md`,
  row: tw`flex-row items-center p-3 `,
  iconbg: tw`mr-4 w-8 h-8 bg-tosaticonbg rounded-2 justify-center items-center`,
  icon: tw`w-6 h-6  `,
  text: {
    ...tw`text-base text-white flex-1`,
    fontFamily: 'FunnelDisplay-Regular',
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
});
