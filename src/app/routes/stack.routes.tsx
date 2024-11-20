import { createStackNavigator } from '@react-navigation/stack';
import DrawerRoutes from './drawer.routes';

const Stack = createStackNavigator();

export default function StackRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Drawer" component={DrawerRoutes} />
        </Stack.Navigator>
    )
}