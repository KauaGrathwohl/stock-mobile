import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';

import TabRoutes from './tab.routes';
import Products from '../(auth)/products';
import Categories from '../(auth)/categories';
import Suppliers from '../(auth)/suppliers';
import Stock from '../(auth)/stock';
import Profile from '../(auth)/profile';

import { useAuth } from '@/src/hooks/useAuth';
import { router } from 'expo-router';

type DrawerMenuItem = {
    name: string;
    label: string;
    title?: string;
    Icon?: any;
    component?: any;
};

const menuItems: Array<DrawerMenuItem> = [
    { name: "TabRoutes", label: "Home", Icon: 'home', component: TabRoutes },
    { name: "Stock", label: "Stock", Icon: 'archive', component: Stock },
    { name: "Products", label: "Products", Icon: 'box', component: Products },
    { name: "Categories", label: "Categories", Icon: 'list', component: Categories },
    { name: "Suppliers", label: "Suppliers", Icon: 'users', component: Suppliers },
    { name: "Profile", label: "Profile", Icon: 'user', component: Profile },
];

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
                headerTitle: 'StockSense'
            }}
            drawerContent={(props) => (
                <CustomDrawerContent {...props} onLogout={handleLogout} />
            )}
        >
            {menuItems.map(({ name, label, Icon, component }) => (
                <Drawer.Screen
                    key={name}
                    name={name}
                    component={component}
                    options={{
                        drawerIcon: ({ color, size }) => <Feather name={Icon} color={color} size={size}/>,
                        drawerLabel: label
                    }}
                />
            ))}
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