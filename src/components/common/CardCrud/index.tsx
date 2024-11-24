import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";

interface CardCrudProps {
    value: {
        key: string;
        value: string | number | null;
    }[];
}

export const CardCrud = ({ value }: CardCrudProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <Text style={styles.productName}>{value[0]?.value}</Text>
                <Text style={styles.productQuantity}>{value[1]?.value}</Text>
            </View>
            <View style={styles.rightSection}>
                <Text style={styles.validityLabel}>{value[2]?.key}</Text>
                <Text style={styles.validityDate}>{value[2]?.value}</Text>
            </View>
        </View>
    );
};
