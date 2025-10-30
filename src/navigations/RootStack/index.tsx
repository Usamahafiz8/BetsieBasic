import React, { useEffect, useState } from 'react';

import HomeStack from '../HomeStack';
import AuthStack from '../AuthStack';
import Loader from '../../constant/Loader';
import Splash from '../../screens/AuthScreens/Splash';
import { useBetsieStore } from '../../store/useBetsieStore';

const RootStack = () => {
  const { user, tryAutoLogin } = useBetsieStore();
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    await tryAutoLogin();
    setIsAuthChecked(true);
  };

  // TEMP bypass: force show stacks to diagnose black screen
  return user ? <HomeStack /> : <AuthStack />;
};

export default RootStack;