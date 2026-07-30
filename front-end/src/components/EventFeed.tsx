import React from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { EventCard } from '@/components/EventCard'; 
import { colors } from '@/styles/global'
import { EventFilters } from '@/services/eventService'
import { useEventsFeed } from '@/hooks/useEventsFeed'
import { getImageUrl } from '@/utils/image'

interface EventFeedProps {
  filtrosAtivos: EventFilters;
}

export default function EventFeed({ filtrosAtivos }: EventFeedProps) {
  const { data, loading, loadMoreEvents } = useEventsFeed(filtrosAtivos, 20);

  // Componente de Loading que aparece no final da lista
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={colors.bluePrimary}/>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null; // Não mostra o estado vazio enquanto carrega
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nada encontrado</Text>
        <Text style={styles.emptySubtitle}>Tente outra palavra ou categoria.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        // O renderItem desenha o seu EventCard para cada item da lista
        renderItem={({ item }) => {
          const dateObj = new Date(item.start_date);
          const formattedDate = dateObj.toLocaleDateString('pt-BR');
          const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

          return (
            <EventCard
              id={item.id}
              title={item.title}
              organizer={"Comunidade USP"} // Placeholder temporário
              location={item.local}
              dates={formattedDate}
              time={formattedTime}
              free={true} // Placeholder temporário
              image={item.banner ? { uri: getImageUrl(item.banner)! } : undefined}
            />
          );
        }}
        // O Scroll Infinito acontece aqui:
        onEndReached={() => loadMoreEvents(false)}
        // Define o quão perto do final da lista o usuário precisa chegar para disparar o onEndReached. 
        // 0.2 significa "quando faltar 20% para chegar no fim, carregue mais".
        onEndReachedThreshold={0.2} 
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={data.length === 0 && !loading ? [styles.listContainer, { flex: 1 }] : styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark, 
  },
  listContainer: {
    padding: 8,
    paddingBottom: 40, // Espaço extra no final da rolagem
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: colors.textPrimaryDark,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});