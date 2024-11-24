import React from "react";
import { Text, TextInput, View } from "react-native";
import { styles } from "./styles";
import { Feather } from "@expo/vector-icons";

interface SearchProps {
    label?: string;
    setValue: any
    value: string;
    placeholder: string;
}

export const Search = ({ placeholder, setValue, value, label }: SearchProps) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.Label}>{label}</Text>}
            <View style={styles.inputContainer}>
                <Feather name="search" size={20} color="gray" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    onChangeText={setValue}
                    value={value}
                />
            </View>
        </View>
    );
};