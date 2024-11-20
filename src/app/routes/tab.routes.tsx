import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Home from '../(auth)/home';
import Stock from '../(auth)/stock';
import Profile from '../(auth)/profile';
import { Feather } from '@expo/vector-icons';
import StockFlow from '../(auth)/stockFlow';

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
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name='user' color={color} size={size}/>,
                    tabBarLabel: 'Profile'
                }}
            />
        </Tab.Navigator>
    )
}