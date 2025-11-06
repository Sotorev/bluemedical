import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { TaskStatus } from '../../types';
import { COLORS } from '../../utils/constants';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'status';
  status?: TaskStatus;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  status,
  style,
}) => {
  const getStatusStyle = () => {
    if (variant === 'status' && status) {
      switch (status) {
        case 'pendiente':
          return styles.statusPendiente;
        case 'en progreso':
          return styles.statusEnProgreso;
        case 'completada':
          return styles.statusCompletada;
        default:
          return styles.default;
      }
    }
    return styles.default;
  };

  const getTextStyle = () => {
    if (variant === 'status' && status) {
      switch (status) {
        case 'pendiente':
          return styles.textPendiente;
        case 'en progreso':
          return styles.textEnProgreso;
        case 'completada':
          return styles.textCompletada;
        default:
          return styles.textDefault;
      }
    }
    return styles.textDefault;
  };

  return (
    <View style={[styles.badge, getStatusStyle(), style]}>
      <Text style={getTextStyle()}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: COLORS.gray[100],
  },
  statusPendiente: {
    backgroundColor: COLORS.yellow[100],
  },
  statusEnProgreso: {
    backgroundColor: COLORS.blue[100],
  },
  statusCompletada: {
    backgroundColor: COLORS.green[100],
  },
  textDefault: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray[800],
  },
  textPendiente: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.yellow[800],
  },
  textEnProgreso: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.blue[600],
  },
  textCompletada: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.green[800],
  },
});

