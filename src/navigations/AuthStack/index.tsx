import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PrivacyPolicy from '../../utils/PrivacyPolicy';
import SignIn from '../../screens/AuthScreens/SignIn';
import TermsOfService from '../../utils/TermsOfService';
import CheckEmail from '../../screens/AuthScreens/CheckEmail';
import CreateUserName from '../../screens/AuthScreens/CreateUserName';
import ResetPassword from '../../screens/AuthScreens/ResetPassword';
import SignupEmail from '../../screens/AuthScreens/SignupEmail';
import AccountCreation from '../../screens/AuthScreens/AccountCreation';
import ChangePassword from '../../screens/AuthScreens/ChangePassword'
const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="AccountCreation"
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name="AccountCreation" component={AccountCreation} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignupEmail" component={SignupEmail} />
    <Stack.Screen name="CreateUserName" component={CreateUserName} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
    <Stack.Screen name="CheckEmail" component={CheckEmail} />
    <Stack.Screen name="TermsOfService" component={TermsOfService} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    <Stack.Screen name="ChangePassword" component={ChangePassword}/>
  </Stack.Navigator>
);

export default AuthStack;
