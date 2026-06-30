// src/components/SocialFeed.tsx
import React from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { colors } from '@/styles/global';

interface SocialFeedProps {
  data: any[];
  renderItem: ({ item }: { item: any }) => React.ReactElement;
  onEndReached: () => void;
  loading?: boolean;
}

export function SocialFeed({ data, renderItem, onEndReached, loading }: SocialFeedProps) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ListFooterComponent={loading ? <ActivityIndicator color={colors.bluePrimary} /> : null}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 20 },
});