import React from 'react';
import { View, StyleSheet, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { colors, globalStyles } from '@/styles/global';
import HomeHeader from '@/components/HomeHeader';
import { useFollowingEventsFeed } from '@/hooks/useFollowingEventsFeed';

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const imageWidth = 350; // Ajuste conforme seu layout

  // Hook customizado para gerenciar a paginação do feed de quem você segue
  const followingFeed = useFollowingEventsFeed(20);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / imageWidth);
    setActiveIndex(index);
  };

  return (
    <View style={globalStyles.container}>
      {/* Cabeçalho fixo no topo */}
      <View>
        <HomeHeader />
      </View>

      {/* Usamos um FlatList ou passamos o header como componente interno se preferir scroll unificado, 
          mas seguindo o padrão do SearchPage, o EventFeed gerencia sua própria lista paginada */}
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eventos de quem você segue</Text>
        </View>

        {/* Reutilizando a arquitetura do EventFeed com o hook customizado de seguindo */}
        <CustomFollowingEventFeed />
      </View>
    </View>
  );
}

// Sub-componente dedicado para injetar o hook de seguindo no modelo do EventFeed
import { FlatList, ActivityIndicator } from 'react-native';
import { EventCard } from '@/components/EventCard';
import { getImageUrl } from '@/utils/image';

function CustomFollowingEventFeed() {
  const { data, loading, loadMoreEvents } = useFollowingEventsFeed(20);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={colors.bluePrimary}/>
      </View>
    );
  };

  return (
    <View style={styles.feedContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const dateObj = new Date(item.start_date);
          const formattedDate = dateObj.toLocaleDateString('pt-BR');
          const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

          return (
            <EventCard
              id={item.id}
              title={item.title}
              organizer={"Comunidade USP"}
              location={item.local}
              dates={formattedDate}
              time={formattedTime}
              free={true}
              image={item.banner ? { uri: getImageUrl(item.banner)! } : undefined}
            />
          );
        }}
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
                Nenhum evento encontrado de quem você segue.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginHorizontal: 8,
    marginTop: 12,
  },
  feedContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textPrimaryDark,
  },
  listContainer: {
    paddingBottom: 40,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});