import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { HomeIcon } from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";

type DrawerMenuItem = {
  name: string;
  label: string;
  title?: string;
  Icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
};

const menuItems: Array<DrawerMenuItem> = [
  { name: "index", label: "Home", Icon: HomeIcon },
  { name: "explore", label: "Explore", title: "Explore page" },
];

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        {menuItems.map(({ name, label, title, Icon }) => (
          <Drawer.Screen
            key={name}
            name={name} // This is the name of the page and must match the url from root
            options={{
              drawerLabel: label,
              title: title || label,
              drawerIcon: ({ color, size }) =>
                Icon && <Icon color={color} fontSize={size} />,
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
}
