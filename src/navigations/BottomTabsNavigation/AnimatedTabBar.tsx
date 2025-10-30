import React from 'react';
import { Platform, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import tw from '../../lib/tailwind';
import { Tabs } from './Tabs';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View
      style={[
        tw`bg-white border-t border-borders`,
        {
          height: 100,
          paddingBottom: 20,
          paddingTop: 10,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
            },
            android: {
              elevation: 8,
              borderTopWidth: 3,
              borderColor: tw.color('borders'),
            },
          }),
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: 0,
        },
      ]}
    >
      <View style={tw`flex-row justify-around items-center flex-1`}>
        {Tabs.filter(tab => tab.isShow).map((tab, index) => {
          const route = state.routes[index];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity 
              key={index} 
              style={tw`flex-1 items-center justify-center`}
              onPress={onPress}
              activeOpacity={0.9}
            >
              <Image
                source={isFocused ? tab.activeIcon : tab.inactiveIcon}
                style={{
                  width: 24,
                  height: 24,
                }}
                resizeMode="contain"
              />
              
              <Text
                style={{
                  ...tw`text-xs mt-1 font-medium`,
                  color: isFocused ? "#FF094E" : "#989898",
                }}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default AnimatedTabBar;
