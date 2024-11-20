import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Home from '../(auth)/home';
import StockFlow from '../(auth)/stockFlow';
import Profile from '../(auth)/profile';
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: '#000',
            headerShown: false
        }}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name='home' color={color} size={size}/>,
                    tabBarLabel: 'Home'
                }}
            />
            <Tab.Screen
                name="StockFlow"
                component={StockFlow}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name='move' color={color} size={size}/>,
                    tabBarLabel: 'Stock Flow'
                }}
            />
        </Tab.Navigator>
    )
}