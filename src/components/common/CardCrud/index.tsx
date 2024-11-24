import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";

interface CardCrudProps {
   topLeft?: string | null ;
   bottomLeft?: string | null;
   rightTop?: string | null;
   rightBottom?: string | null;
}

export const CardCrud = ({ topLeft,bottomLeft,rightTop,rightBottom}: CardCrudProps) => {

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <Text style={styles.productName}>{topLeft ? topLeft : ''}</Text>
                <Text style={styles.productQuantity}>{bottomLeft ? bottomLeft : ''}</Text>
            </View>
            <View style={styles.rightSection}>
                <Text style={styles.validityLabel}>{rightTop ? rightTop : ''}</Text>
                <Text style={styles.validityDate}>{rightBottom ? rightBottom : ''}</Text>
            </View>
        </View>
    );
};
