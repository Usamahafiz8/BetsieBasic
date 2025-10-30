import React, { useEffect, useState, useRef, useMemo } from 'react';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import axios from 'axios';
import dayjs from 'dayjs';
import BottomSheet from '@gorhom/bottom-sheet';
import type BottomSheetMethods from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';

import ShareBottomSheet from '../../components/ShareBottomSheet';
import Header from '../../../components/Header';
import tw from '../../../lib/tailwind';
import TopTab from '../../components/TopTab';
import { useBetsieStore } from '../../../store/useBetsieStore';
import MyBets from '../MyBets';
import {
  ActiveBetsCard,
  PendingBetsCard,
  CompletedBetsCard,
  MyFeedCard,
} from '../../components/Bets';
import MyFeedToptab from '../../components/MyHomeToptabs';
import ComingSoon from '../../components/ComingSoon';
import { baseUrl } from '../../../api/baseUrl';

type BottomTabParamList = {
  Home: undefined;
  MyBets: { screen: string; params?: { betId: string } };
  AddFriend: undefined;
  CreateBet: undefined;
  Notification: undefined;
  Profile: undefined;
  BetDetail: { bet: Bet };
  ExecuteBetResolutionScreen: { bet: Bet };
  WinningScreen: { bet: Bet };
  BetsResolve: { bet: Bet };
};

type NavigationProp = BottomTabNavigationProp<BottomTabParamList, 'Home'>;

type User = {
  id: number;
  email?: string;
  playerName?: string;
  profilePicture?: string;
};

type Bet = {
  id: number;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  expiresAt?: string;
  creator?: User;
  opponent?: User;
  winner?: User;
  lastLogin?: string; // Added to fix type error
  likesCount?: number;
  commentsCount?: number;
};

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [bets, setBets] = useState<Bet[]>([]);
  const [activeTab, setActiveTab] = useState('Active');
  const [feedTab, setFeedTab] = useState('Public'); // Inner MyFeed tabs
  const [loading, setLoading] = useState(false);
  const { user, token } = useBetsieStore();
  // ✅ Create BottomSheet ref
  const bottomSheetRef = useRef<React.ElementRef<typeof BottomSheet> | null>(
    null,
  );
  const snapPoints = useMemo(() => ['35%'], []);

  // --- helper: pick a best date value from a bet-like object ---
  const getBestDateValue = (b: any) => {
    // prefer createdAt, then startTime, then expiresAt, then lastLogin, then date
    const candidates = [
      b?.createdAt,
      b?.startTime,
      b?.expiresAt,
      b?.lastLogin,
      b?.date,
    ];
    for (const c of candidates) {
      if (c) {
        const parsed = dayjs(c);
        if (parsed.isValid()) return parsed.valueOf();
      }
    }
    return dayjs().valueOf();
  };

  // --- helper: return a new array sorted descending (newest first) by best date ---
  const sortDescendingByDate = (arr: any[]) => {
    if (!Array.isArray(arr)) return arr;
    return arr.slice().sort((a: any, b: any) => {
      return getBestDateValue(b) - getBestDateValue(a);
    });
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!user?.id || !token) return;

    // Only refetch when the screen is visible
    if (isFocused) {
      if (activeTab === 'Home') {
        fetchFeeds(feedTab);
      } else {
        fetchBetsByStatus(activeTab);
      }
    }
  }, [isFocused, activeTab, feedTab, user, token]);

  // --- Fetch Active / Pending / Completed ---
  const fetchBetsByStatus = async (status: string) => {
    if (!user?.id || !token) return;
    setLoading(true);
    try {
      let endpoint = '';
      switch (status) {
        case 'Active':
          endpoint = `${baseUrl}/bets/active/${user.id}`;
          break;
        case 'Pending':
          endpoint = `${baseUrl}/bets/pending/${user.id}`;
          break;
        case 'Completed':
          endpoint = `${baseUrl}/bets/completed/${user.id}`;
          break;
        default:
          endpoint = `${baseUrl}/bets/active/${user.id}`;
      }

      console.log(`📡 Fetching ${status} bets from:`, endpoint);

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`✅ ${status} API response:`, res.data);

      let items: any[] = [];
      if (Array.isArray(res.data)) items = res.data;
      else if (res.data?.data)
        items = Array.isArray(res.data.data) ? res.data.data : [];
      setBets(sortDescendingByDate(items));
    } catch (error) {
      console.error(`❌ Error fetching ${status} bets:`, error);
      setBets([]);
    } finally {
      setLoading(false);
    }
  };

  //  const fetchFeeds = async (tab: string) => {
  //     setLoading(true);
  //     try {
  //       let endpoint = "";
  //       if (tab === "Friends") {
  //         endpoint = `${API_BASE}/feed/friends-only?page=1&limit=20`;
  //       } else if (tab === "Public") {
  //         endpoint = `${API_BASE}/feed/public?page=1&limit=20`;
  //       }

  //       const res = await axios.get(endpoint, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       const feeds = res.data.data?.feeds || [];
  //       setBets(sortDescendingByDate(feeds));
  //     } catch (error) {
  //       console.error("Error fetching feeds:", error);
  //       setBets([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // --- Fetch Feeds (Friends / Public) ---
  const fetchFeeds = async (tab: string) => {
    // Only Friends feed should fetch data
    if (tab === 'Public') {
      setBets([]); // Clear feed
      return; // ✅ Stop API call
    }

    setLoading(true);
    try {
      const endpoint = `${baseUrl}/feed/friends-only?page=1&limit=20`;
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const feeds = res.data.data?.feeds || [];
      setBets(sortDescendingByDate(feeds));
    } catch (error) {
      console.error('Error fetching friends feed:', error);
      setBets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBetCardPress = (
    bet: Bet,
    action: 'detail' | 'resolve' = 'detail',
    extra: Record<string, any> = {},
  ) => {
    console.log(
      '🚀 ~ handleBetCardPress ~ bet.status?.toLowerCase():',
      bet.status?.toLowerCase(),
    );
    switch (bet.status?.toLowerCase()) {
      case 'pending':
        // navigation.navigate("BetDetail", { bet, ...extra });
        navigation.navigate('BetDetail', { bet });
        break;
      case 'active':
        if (action === 'resolve') {
          navigation.navigate('BetsResolve', { bet });
        } else {
          navigation.navigate('BetDetail', { bet });
        }
        break;
      case 'completed':
      case 'withdraw':
        navigation.navigate('Winning', { bet });
        break;
      default:
        console.warn('Unknown bet status:', bet.status);
    }
  };

  const getDisplayName = (user?: User) => user?.playerName;

  const renderEmpty = () =>
    !loading && (
      <View>
        <MyBets />
      </View>
    );

  if (!user || !token) {
    return (
      <SafeAreaView style={tw`flex-1 items-center justify-center`}>
        <Text>Please login to see your bets.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header
        title="Create New"
        onPress={() =>
          navigation.navigate('CreateBet', {
            screen: 'DefineBet',
          })
        }
      />

      <View style={tw`mx-4`}>
        <TopTab onTabChange={setActiveTab} />
      </View>

      {/* ✅ inside your Home component return() */}

      <LinearGradient
        colors={['#F5444E', 'rgba(246, 62, 78, 0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={tw`rounded-lg p-[2px] mx-3 my-3`}
      >
        <View style={tw`bg-white rounded-lg`}>
          {loading ? (
            <ActivityIndicator size="large" color="#F5444E" style={tw`mt-10`} />
          ) : (
            <FlatList
              data={bets}
              keyExtractor={item => item.id.toString()}
              onRefresh={() => {
                if (activeTab === 'My Feed') {
                  fetchFeeds(feedTab);
                } else {
                  fetchBetsByStatus(activeTab);
                }
              }}
              refreshing={loading}
              ListHeaderComponent={
                <View style={tw`mt-4 mb-4`}>
                  {activeTab === 'Home' ? (
                    <MyFeedToptab onTabChange={setFeedTab} />
                  ) : (
                    <View />
                  )}
                </View>
              }
              renderItem={({ item }) => {
                switch (activeTab) {
                  case 'Active':
                    return (
                      <ActiveBetsCard
                        id={item.id.toString()}
                        avatar={
                          user?.id === item?.creator?.id
                            ? item?.opponent?.profilePicture
                            : item?.creator?.profilePicture
                        }
                        // avatar={
                        //   item.creator?.profilePicture ||
                        //   item.opponent?.profilePicture ||
                        //   item.winner?.profilePicture
                        // }
                        name={
                          user?.id === item?.creator?.id
                            ? item.opponent?.playerName
                            : item.creator?.playerName
                        }
                        // name={
                        //   getDisplayName(item.creator) ||
                        //   getDisplayName(item.opponent) ||
                        //   getDisplayName(item.winner)
                        // }
                        description={item.description}
                        startTime={item.createdAt}
                        endTime={item.expiresAt}
                        status={item.status as any}
                        onPressCard={() => handleBetCardPress(item, 'detail')}
                        onChooseWinner={() =>
                          handleBetCardPress(item, 'resolve')
                        }
                      />
                    );

                  case 'Pending':
                    return (
                      <PendingBetsCard
                        id={item.id.toString()}
                        avatar={
                          user?.id === item?.creator?.id
                            ? item.opponent?.profilePicture
                            : item.creator?.profilePicture
                        }
                        // name={`${getDisplayName(item.opponent)}`}
                        name={
                          user?.id === item?.creator?.id
                            ? item.opponent?.playerName
                            : item.creator?.playerName
                        }
                        description={item.description}
                        date={item.expiresAt}
                        status={item.status}
                        onPress={() =>
                          handleBetCardPress(item, 'detail', {
                            scrollToAccept: true,
                          })
                        }
                      />
                    );

                  case 'Completed':
                    return (
                      <CompletedBetsCard
                        id={item.id.toString()}
                        // name={getDisplayName(item.winner)}
                        avatar={
                          user?.id === item?.creator?.id
                            ? item?.opponent?.profilePicture
                            : item?.creator?.profilePicture
                        }
                        name={
                          user?.id === item?.creator?.id
                            ? item.opponent?.playerName
                            : item.creator?.playerName
                        }
                        description={item.description}
                        date={item.expiresAt}
                        status={item.status}
                        onPress={() => handleBetCardPress(item)}
                      />
                    );

                  case 'Home':
                    return (
                      <MyFeedCard
                        id={item.id.toString()}
                        avatar={
                          item.creator?.profilePicture ||
                          (item as any).user?.profilePicture ||
                          item.opponent?.profilePicture ||
                          item.winner?.profilePicture
                        }
                        name={item.bet?.creator.playerName}
                        // name={
                        //   getDisplayName(item.creator) ||
                        //   getDisplayName((item as any).user) ||
                        //   getDisplayName(item.opponent) ||
                        //   getDisplayName(item.winner)
                        // }
                        title={
                          (item as any).title ||
                          (item as any).feedTitle ||
                          (item as any).messageTitle ||
                          ''
                        }
                        description={
                          (item as any).description ||
                          (item as any).message ||
                          `User joined with email: ${(item as any).email || ''}`
                        }
                        date={
                          item.lastLogin ||
                          item.createdAt ||
                          new Date().toISOString()
                        }
                        status={item.status || 'Active'}
                        likesCount={
                          (item as any).likesCount || (item as any).likes || 0
                        }
                        commentsCount={
                          (item as any).commentsCount ||
                          (item as any).comments ||
                          0
                        }
                        bottomSheetRef={
                          bottomSheetRef as React.RefObject<BottomSheetMethods>
                        } // ✅ type cast

                        // bottomSheetRef={bottomSheetRef} // ✅ single correct ref
                      />
                    );

                  default:
                    return null;
                }
              }}
              ListEmptyComponent={renderEmpty}
              contentContainerStyle={tw`px-4 pt-2 pb-16`}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </LinearGradient>

      {/* ✅ Bottom Sheet (only one instance) */}
      <ShareBottomSheet ref={bottomSheetRef} snapPoints={snapPoints} />
    </SafeAreaView>
  );
};

export default Home;
