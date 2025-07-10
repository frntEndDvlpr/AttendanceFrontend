import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccountScreen from '../screens/AccountScreen';
import CorrectionRequestNavigator from './CorrectionRequestNavigator';

const Stak = createNativeStackNavigator();

const ProfileNavigator = () => (
    <Stak.Navigator>
        <Stak.Screen name="Account" component={AccountScreen} options={{headerShown: false}}/>
        <Stak.Screen
            name="CorrectionRequest"
            component={CorrectionRequestNavigator}
            options={{headerShown: false}}
        />
    </Stak.Navigator>
);

export default ProfileNavigator;