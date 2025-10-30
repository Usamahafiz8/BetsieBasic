import { ActivityIndicator, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import tw from '../../../lib/tailwind';
import Header from '../../../components/Header';
import GradientText from '../../../components/GradientText';
import { baseUrl } from '../../../api/baseUrl';
import { useBetsieStore } from '../../../store/useBetsieStore';

type StatItem = {
  label: string;
  value: number;
};

const BetHistory: React.FC = () => {
  const navigation = useNavigation();
  const { user, token } = useBetsieStore();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBetHistory = async () => {
      try {
        const res = await fetch(`${baseUrl}/bets/history/${user?.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // ✅ Replace with dynamic token
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('🚀 ~ fetchBetHistory ~ data:', data);

        // Map API response into stats format
        const formatted: StatItem[] = [
          { label: 'Bets Created', value: data.totalCreated },
          { label: 'Bets Accepted', value: data.totalAccepted },
          { label: 'Active Bets', value: data.activeBets },
          { label: 'Completed Bets', value: data.completedBets },
          { label: 'Bets Won', value: data.wonBets },
          { label: 'Bets Lost', value: data.lostBets },
        ];

        setStats(formatted);
      } catch (error) {
        console.error('❌ Error fetching bet history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBetHistory();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="red" />
        <Text style={tw`mt-4 text-gray-600`}>Loading history...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header showBack onPress={() => navigation.goBack()} />
      <Text style={tw`font-semibold text-center text-xl py-2`}>
        Bet History Summary
      </Text>
      <View style={tw`px-6`}>
        {stats.map((item, index) => (
          <View key={index}>
            {/* Row */}
            <View style={tw`flex-row justify-between items-center py-5 px-4`}>
              <Text style={tw`text-black text-base`}>{item.label}</Text>
              <GradientText
                style={tw`font-regular text-base`}
                text={item?.value.toString()}
              />
            </View>

            {/* Divider (except last item) */}
            {index < stats.length - 1 && (
              <View style={tw`h-[2px] bg-red-300`} />
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default BetHistory;
