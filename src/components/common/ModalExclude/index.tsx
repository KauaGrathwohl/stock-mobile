import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { styles } from './styles';
import { Button } from '../Button';

interface ModalExcludeProps {
    visible: boolean; // Controla a visibilidade do modal
    onCancel: () => void; // Função chamada ao cancelar
    onConfirm: () => void; // Função chamada ao confirmar
    nomeItem: string; // Nome do item a ser excluído
}

export function ModalExclude({
    visible,
    onCancel,
    onConfirm,
    nomeItem,
}: ModalExcludeProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Atenção</Text>
                    <Text style={styles.message}>
                        Você tem certeza que deseja deletar "{nomeItem}"
                        Essa ação é irreversível.
                    </Text>
                    <View style={styles.actions}>
                       <Button title='Cancelar' onPress={onCancel}>

                       </Button>
                       <Button title='Excluir'onPress={onConfirm}>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
