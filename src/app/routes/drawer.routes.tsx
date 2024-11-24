import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';

import TabRoutes from './tab.routes';
import Products from '../(auth)/products';
import { Categories } from '../(auth)/categories/categories';
import { Suppliers } from '../(auth)/suppliers/suppliers';
import Stock from '../(auth)/stock';
import Profile from '../(auth)/profile';

import { useAuth } from '@/src/hooks/useAuth';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

type DrawerMenuItem = {
    name: string;
    label: string;
    title?: string;
    Icon?: any;
    component?: any;
};

const menuItems: Array<DrawerMenuItem> = [
    { name: "Home", label: "Home", Icon: 'home', component: TabRoutes },
    { name: "Lotes", label: "Lotes", Icon: 'archive', component: Stock },
    { name: "Produtos", label: "Produtos", Icon: 'box', component: Products },
    { name: "Categorias", label: "Categorias", Icon: 'list', component: Categories },
    { name: "Fornecedores", label: "Fornecedores", Icon: 'users', component: Suppliers },
    { name: "Perfil", label: "Perfil", Icon: 'user', component: Profile },
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
                drawerActiveTintColor: '#000'
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
    const auth = useAuth();

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.userHeader}>
                <Feather name="package" size={56} color="#000" />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{auth?.user?.nome}</Text>
                    <Text style={styles.userDetails}>{auth?.user?.cargo?.descricao}</Text>
                    <Text style={styles.userDetails}>{auth?.user?.empresa?.descricao}</Text>
                </View>
            </View>

            <DrawerItemList {...props} />
            <DrawerItem
                label="Logout"
                icon={({ color, size }) => <Feather name="log-out" color={color} size={size} />}
                onPress={onLogout}
            />
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D4D4D4',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    userInfo: {
        marginLeft: 12,
    },
    userName: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userDetails: {
        color: '#000',
        fontSize: 14,
    },
});