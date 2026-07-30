import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, globalStyles } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';

type HomeHeaderProps = {
  title?: string;
  hasNotification?: boolean;
  onNotificationPress?: () => void;
};

export default function HomeHeader({
  title = 'EventUSP',
  hasNotification = false,
  onNotificationPress,
}: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.pageTitle}>{title}</Text>

      <TouchableOpacity
        style={styles.bellButton}
        onPress={onNotificationPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color={colors.orangePrimary}
          style={styles.icon}
        />
        {hasNotification && <View style={styles.badge} />}
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  bellButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    opacity: 1,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orangePrimary,
    borderWidth: 1,
    borderColor: colors.backgroundDark,
  },
});