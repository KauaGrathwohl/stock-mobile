import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface BadgeProps {
    variant: 'success' | 'danger' | 'warning';
    icon?: any;
};

export const Badge = ({ variant, icon }: BadgeProps) => {
    return (
        <View style={styles.badge}>
            <View style={[styles.badgeIcon, styles[variant]]}>
                {icon ? (
                    <Feather name={icon} size={24} color="#000" />
                ) : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    badge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeIcon: {
        width: 36,
        height: 36,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    success: {
        backgroundColor: '#2FE973',
    },
    danger: {
        backgroundColor: '#FF6666',
    },
    warning: {
        backgroundColor: '#FFD82E',
    },
});

