import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from '../../common/Badge';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface CardLoveVencimentoProps {
  id: number;
  codigoBarras: string;
  status: string;
  dataFabricacao: string;
  dataVencimento: string;
  produto: {
    id: number;
    descricao: string;
  }
};

export const CardLoteVencimento = ({
  id,
  codigoBarras,
  status,
  dataFabricacao,
  dataVencimento,
  produto
}: CardLoveVencimentoProps) => {

  const badgeVariant = status === 'expired' ? 'danger' : status === 'expiring' ? 'warning' : 'success';
  const icon = status === 'expired' ? 'x-circle' : status === 'expiring' ? 'alert-triangle' : 'check-circle';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        console.log('CardLoteVencimento');
        console.log('id', id);
      }}
    >
      <Badge
        variant={badgeVariant}
        icon={icon}
      />
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Text style={styles.p}>
            {produto?.descricao}
          </Text>
          <Text style={styles.small}>
            Código: {codigoBarras}
          </Text>
        </View>
        <Text style={styles.date}>
          {dataVencimento}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 380,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
    backgroundColor: '#ffff',
    borderRadius: 8,
    shadowColor: '#080808',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  p: {
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 20,
    color: '#080808',
  },
  small: {
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
    color: '#080808',
    marginTop: 4,
  },
  date: {
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
    color: '#080808',
  },
});
