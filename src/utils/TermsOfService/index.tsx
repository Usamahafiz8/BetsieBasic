import React from 'react';
import { ScrollView, View } from 'react-native';

import Header from '../../components/MainHeader';
import Content from '../../components/text/Content';
import Title from '../../components/text/Title';
import tw from '../../lib/tailwind';

const TermsOfService: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={tw`flex-1 bg-white`}>
      <Header title="Terms of Service" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={tw`px-5 py-4`}>
        <Content text="Please read these Terms of Service carefully before using our application." />

        <Title text="1. Acceptance of Terms" style={tw`mt-5 mb-2`} />
        <Content text="By accessing or using our services, you agree to be bound by these terms." />

        <Title text="2. User Responsibilities" style={tw`mt-5 mb-2`} />
        <Content text="You agree not to misuse the services or help anyone else to do so." />

        <Title text="3. Intellectual Property" style={tw`mt-5 mb-2`} />
        <Content text="All content provided in the app remains our property and is protected by copyright laws." />

        <Title text="4. Termination" style={tw`mt-5 mb-2`} />
        <Content
          text="We reserve the right to suspend or terminate your access to the services at our discretion."
          style={tw`mb-10`}
        />
      </ScrollView>
    </View>
  );
};

export default TermsOfService;
