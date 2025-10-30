import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../../screens/HomeScreens/Home';
import MyBets from '../../screens/HomeScreens/MyBets';
import AddFriend from '../../screens/HomeScreens/AddFriend';
import CreateBet from '../../screens/HomeScreens/CreateBet';
import ProfileScreen from '../../screens/HomeScreens/ProfileScreen';
import WinningScreen from '../../screens/HomeScreens/WinningScreen';
import Support from '../../screens/HomeScreens/ProfileScreen/support';
import ChooseDecision from '../../screens/HomeScreens/ChooseDecision';
import BetDetailScreen from '../../screens/HomeScreens/BetDetailScreen';
import NotificationScreen from '../../screens/HomeScreens/NotificationScreen';
import ChangeEmail from '../../screens/HomeScreens/ProfileScreen/changeEmail';
import AccountDetail from '../../screens/HomeScreens/ProfileScreen/accountDetail';
import UpdateSuccess from '../../screens/HomeScreens/ProfileScreen/updateSuccess';
import ChooseDecisionMethod from '../../screens/HomeScreens/ChooseDecisionMethod';
import ChangePassword from '../../screens/HomeScreens/ProfileScreen/changePassword';
import ChangeUsername from '../../screens/HomeScreens/ProfileScreen/changeUsername';
import DefineBet from '../../screens/HomeScreens/DefineBet';
import ExecuteBetResolutionScreen from '../../screens/HomeScreens/ExecuteBetResolutionScreen';
import BetHistory from '../../screens/HomeScreens/ProfileScreen/betHistory';
import FriendList from '../../screens/HomeScreens/ProfileScreen/friendList';
import StakeDiscussionScreen from '../../screens/HomeScreens/StakeDiscussionScreen';
import AnimatedTabBar from '../BottomTabsNavigation/AnimatedTabBar';
import BetsResolve from '../../screens/HomeScreens/BetsResolve';
import FriendProfile from '../../screens/HomeScreens/FriendProfile';
import ComingSoon from '../../screens/components/ComingSoon';
import BetReview from '../../screens/HomeScreens/BetReview';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* ===================== STACKS ===================== */
export const MyBetsStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{ animation: 'slide_from_right', headerShown: false }}
  >
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="MyBetsScreen" component={MyBets} />
    <Stack.Screen name="ComingSoon" component={ComingSoon} />
    <Stack.Screen name="BetDetail" component={BetDetailScreen} />
    <Stack.Screen name="BetsResolve" component={BetsResolve} />
    <Stack.Screen name="StakeDiscussion" component={StakeDiscussionScreen} />
    <Stack.Screen
      name="ExecuteBetResolution"
      component={ExecuteBetResolutionScreen}
    />
    <Stack.Screen name="Winning" component={WinningScreen} />
  </Stack.Navigator>
);

export const FriendProfileStack = () => (
  <Stack.Navigator
    initialRouteName="FriendProfile"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="FriendProfile" component={FriendProfile} />
    <Stack.Screen name="CreateBet" component={CreateBetStack} />
  </Stack.Navigator>
);

export const AddFriendStack = () => (
  <Stack.Navigator
    initialRouteName="AddFriendMain"
    screenOptions={{ animation: 'slide_from_right', headerShown: false }}
  >
    <Stack.Screen name="AddFriendMain" component={AddFriend} />
    <Stack.Screen name="FriendProfileStack" component={FriendProfileStack} />
  </Stack.Navigator>
);

export const ProfileStack = () => (
  <Stack.Navigator
    initialRouteName="ProfileMain"
    screenOptions={{ animation: 'slide_from_right', headerShown: false }}
  >
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="AccountDetail" component={AccountDetail} />
    <Stack.Screen name="ChangeUsername" component={ChangeUsername} />
    <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="UpdateSuccess" component={UpdateSuccess} />
    <Stack.Screen name="BetHistory" component={BetHistory} />
    <Stack.Screen name="FriendList" component={FriendList} />
    <Stack.Screen name="Support" component={Support} />
    <Stack.Screen name="FriendProfileStack" component={FriendProfileStack} />
  </Stack.Navigator>
);

export const NotificationStack = () => (
  <Stack.Navigator
    initialRouteName="NotificationScreen"
    screenOptions={{ animation: 'slide_from_right', headerShown: false }}
  >
    <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
  </Stack.Navigator>
);

export const CreateBetStack = () => (
  <Stack.Navigator
    // initialRouteName="DefineBet"
    screenOptions={{ animation: 'slide_from_right', headerShown: false }}
  >
    <Stack.Screen name="DefineBet" component={DefineBet} />
    <Stack.Screen name="ChooseDecision" component={ChooseDecision} />
    <Stack.Screen
      name="ChooseDecisionMethod"
      component={ChooseDecisionMethod}
    />
    <Stack.Screen name="BetReview" component={BetReview} />
    <Stack.Screen name="StakeDiscussion" component={StakeDiscussionScreen} />  
  </Stack.Navigator>
);

const HomeStack = () => (
  <Tab.Navigator
    tabBar={props => <AnimatedTabBar {...props} />}
    initialRouteName="MyBets"
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="MyBets" component={MyBetsStack} />
    <Tab.Screen name="AddFriend" component={AddFriendStack} />
    <Tab.Screen name="CreateBet" component={CreateBetStack} />
    <Tab.Screen name="Notification" component={NotificationStack} />
    <Tab.Screen name="profile" component={ProfileStack} />
  </Tab.Navigator>
);

export default HomeStack;
