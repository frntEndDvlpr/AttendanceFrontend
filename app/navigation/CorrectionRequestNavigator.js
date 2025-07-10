import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AppText from '../components/AppText';
import CorrectionRequestFormScreen from '../screens/CorrectionRequestFormScreen';
import CorrectionRequestListScreen from '../screens/CorrectionRequestListScreen';

const Stak = createStackNavigator();

const CorrectionRequestNavigator = () => (
  <Stak.Navigator
    screenOptions={{ presentation: 'modal' }}
  >

    <Stak.Screen
      name="CorrectionRequestList"
      component={CorrectionRequestListScreen}
      options={{
        headerTitle: () => <AppText>Correction Requests</AppText>,
        headerBackTitle: 'Back',
      }}
    />

    <Stak.Screen
      name="CorrectionRequestForm"
      component={CorrectionRequestFormScreen}
      options={{
        headerTitle: () => <AppText>Correction Form</AppText>,
        headerBackTitle: 'Dismiss',
      }}
    />
  </Stak.Navigator>
);

export default CorrectionRequestNavigator;
