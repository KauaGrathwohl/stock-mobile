import React from "react";
import { View } from "react-native";
import { styles } from "./styles";

interface ActionsProps {
    children: React.ReactNode[]; 
}

export const Actions = ({ children }: ActionsProps) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
};


