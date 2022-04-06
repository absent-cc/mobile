import React from 'react';
import { Dimensions } from 'react-native';
import {
    createMaterialTopTabNavigator,
    MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import { Feather } from '@expo/vector-icons';
import Home from './pages/Home';
import FullList from './pages/FullList';
import TabBar from './components/TabBar';
import Schedule from './pages/Schedule';

const Tab = createMaterialTopTabNavigator();

function MainScreen() {
    const tabDisplay: Record<
        string,
        { label: string; icon: keyof typeof Feather.glyphMap }
    > = {
        Home: { label: 'Home', icon: 'home' },
        FullList: { label: 'Absences', icon: 'list' },
        Schedule: { label: 'Schedule', icon: 'calendar' },
    };
    const createTabs = (props: MaterialTopTabBarProps) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <TabBar {...props} tabDisplay={tabDisplay} />
    );

    return (
        <Tab.Navigator
            screenOptions={{ swipeEnabled: true }}
            initialRouteName="Home"
            initialLayout={{ width: Dimensions.get('window').width }}
            tabBarPosition="bottom"
            tabBar={createTabs}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="FullList" component={FullList} />
            <Tab.Screen name="Schedule" component={Schedule} />
        </Tab.Navigator>
    );
}

export default MainScreen;
