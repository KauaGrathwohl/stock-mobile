import { TextInput, TextInputProps, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

interface InputProps extends TextInputProps {
    label?: string;
    placeholder?: string;
    type?: string,
    icon?: keyof typeof Ionicons.glyphMap;
}

export function Input({
    label,
    placeholder,
    type,
    icon,
    ...rest
}: InputProps) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                {...rest}
            />
        </View>
    )
}