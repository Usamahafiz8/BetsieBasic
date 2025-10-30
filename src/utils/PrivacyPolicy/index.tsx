import React from 'react';
import { ScrollView, View } from 'react-native';

import Header from '../../components/MainHeader';
import Content from '../../components/text/Content';
import Title from '../../components/text/Title';
import { Fonts } from '../../constant/Fonts';
import tw from '../../lib/tailwind';

const PrivacyPolicy: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={tw`flex-1 bg-white`}>
   <Header title="Forgot Password" onBackPress={() => navigation.goBack()} />


      
      {/* Content */}
      <ScrollView contentContainerStyle={tw`p-4`}>
        <Content 
        style={tw`text-base text-gray-800 mb-4`}
        text='Welcome to our Privacy Policy. Your privacy is critically important to us.' />
          

        <Title style={tw`text-lg font-bold mb-2`}
        text='1. Information We Collect'
        />
        <Content 
        style={tw`text-base text-gray-700 mb-4`}
        text=' We collect personal information such as your name, email, and phone number when you use our services.'  />
        
        <Title 
        style={tw`text-lg font-bold mb-2`}
        text='2. How We Use Information'
        />
        <Content 
        style={tw`text-base text-gray-700 mb-4`}
        text='The information we collect is used to provide and improve our services, personalize your experience, and
          communicate with you. '  />
       
        <Title 
        style={tw`text-lg font-bold mb-2`}
        text='3. Data Security'
        />
           <Content 
           style={tw`text-base text-gray-700 mb-4`}
           text='We take appropriate security measures to protect against unauthorized access, alteration, disclosure, or
          destruction of your personal information. '
           />
          
        <Title 
        
        style={tw`text-lg font-bold mb-2`}
        text='4. Changes'
        />
        
        <Content 
        style={tw`text-base text-gray-700 mb-10`}
        text=' We may update this Privacy Policy from time to time. Please review this page periodically for updates.'
        />
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;
