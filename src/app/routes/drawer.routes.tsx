import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';

import TabRoutes from './tab.routes';
import Products from '../(auth)/products';
import Categories from '../(auth)/categories';
import Suppliers from '../(auth)/suppliers';
import { Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/src/hooks/useAuth';
import { router } from 'expo-router';
import Stock from '../(auth)/stock';

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
    const auth = useAuth();

    const handleLogout = () => {
        auth.logout();
        router.replace('/login' as any);
    };

    return (
        <Drawer.Navigator
            screenOptions={{
                drawerActiveTintColor: '#000',
                headerTitle: ''
            }}

            drawerContent={(props) => (
                <CustomDrawerContent {...props} onLogout={handleLogout} />
            )}
        >
            <Drawer.Screen
                name="TabRoutes"
                component={TabRoutes}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='home' color={color} size={size}/>,
                    drawerLabel: 'Home'
                }}
            />
            <Drawer.Screen
                name="Stock"
                component={Stock}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='box' color={color} size={size}/>,
                    drawerLabel: 'Stock'
                }}
            />
            <Drawer.Screen
                name="Categories"
                component={Categories}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='star' color={color} size={size}/>,
                    drawerLabel: 'Categories'
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
                name="Suppliers"
                component={Suppliers}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name='truck' color={color} size={size}/>,
                    drawerLabel: 'Suppliers'
                }}
            />
        </Drawer.Navigator>
    )
}

function CustomDrawerContent(props: any) {
    const { onLogout } = props;

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
                label="Logout"
                icon={({ color, size }) => <Feather name="log-out" color={color} size={size} />}
                onPress={onLogout}
            />
        </DrawerContentScrollView>
    );
}