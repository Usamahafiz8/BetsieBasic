
import React from 'react';
import { ActivityIndicator, Text,View } from 'react-native';
import tw from '../../lib/tailwind';

type Props = { message?: string };

const Loader: React.FC<Props> = ({ message = 'Loading…' }) => (
  <View style={tw`absolute inset-0 z-50 items-center justify-center bg-black/70`}>
    <ActivityIndicator size="large" color={'#FF094E'}/>
  </View>
);

export default Loader;