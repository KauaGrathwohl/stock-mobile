import { createStackNavigator } from '@react-navigation/stack';
import { CreateCategories, Categories, DetailsCategories, EditCategories } from '../(auth)/categories';
import DrawerRoutes from './drawer.routes';


const Stack = createStackNavigator();



export default function StackRoutes() {
    const routerPageInGoBack = (route: any) => {
        const namePages = ['ItemDetails', 'ItemEdit', 'ItemCreate'];
        return namePages.includes(route.name);
    };

    return (
        <Stack.Navigator
            screenOptions={({ route }) => ({
                headerShown: routerPageInGoBack(route)
            })}
        >
            <Stack.Screen name="Drawer"      component={DrawerRoutes} />
            <Stack.Screen name="ItemDetails" component={DetailsCategories} options={{ headerTitle: "Detalhes do Item", headerBackTitle: "Voltar"}} />
            <Stack.Screen name="ItemEdit"    component={EditCategories} options={{headerTitle: "Edição do Item",headerBackTitle: "Voltar"}} />
            <Stack.Screen name="ItemCreate"  component={CreateCategories} options={{headerTitle: "Criação do Item",headerBackTitle: "Voltar"}} />
        </Stack.Navigator>
    );
}
