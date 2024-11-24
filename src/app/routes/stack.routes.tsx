import { createStackNavigator } from '@react-navigation/stack';
import DrawerRoutes from './drawer.routes';
import ItemDetails from '../(auth)/itemDetails';
import { ItemEdit } from '../(auth)/itemEdit';

const Stack = createStackNavigator();



export default function StackRoutes() {
    const routerPageInGoBack = (route: any) => {
        const namePages = ['ItemDetails', 'ItemEdit'];
        return namePages.includes(route.name);
    };

    return (
        <Stack.Navigator
            screenOptions={({ route }) => ({
                headerShown: routerPageInGoBack(route)
            })}
        >
            <Stack.Screen name="Drawer" component={DrawerRoutes} />
            <Stack.Screen 
                name="ItemDetails" 
                component={ItemDetails} 
                options={{
                    headerTitle: "Detalhes do Item",
                    headerBackTitle: "Voltar",
                }} 
            />
            <Stack.Screen 
                name="ItemEdit" 
                component={ItemEdit} 
                options={{
                    headerTitle: "Detalhes do Item",
                    headerBackTitle: "Voltar",
                }} 
            />
            
        </Stack.Navigator>
    );
}
