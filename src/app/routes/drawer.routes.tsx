import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';

import TabRoutes from './tab.routes';
import Home from '../(auth)/home';
import Profile from '../(auth)/profile';
import Stock from '../(auth)/stock';
import Products from '../(auth)/products';

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
    return (
        <Drawer.Navigator screenOptions={{
            drawerActiveTintColor: '#000',
            headerTitle: ''
        }}>
            <Drawer.Screen
                name="TabRoutes"
                component={TabRoutes}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='home' color={color} size={size}/>,
                    drawerLabel: 'Home'
                }}
            />
            {/* <Drawer.Screen
                name="Home"
                component={Home}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='home' color={color} size={size}/>,
                    drawerLabel: 'Home'
                }}
            /> */}
            <Drawer.Screen
                name="Stock"
                component={Stock}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='box' color={color} size={size}/>,
                    drawerLabel: 'Stock'
                }}
            />
            <Drawer.Screen
                name="Products"
                component={Products}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='shopping-cart' color={color} size={size}/>,
                    drawerLabel: 'Products'
                }}
            />
            <Drawer.Screen
                name="Profile"
                component={Profile}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='user' color={color} size={size}/>,
                    drawerLabel: 'Profile'
                }}
            />
        </Drawer.Navigator>
    )
}