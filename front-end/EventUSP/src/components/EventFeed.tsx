import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { EventCard } from '@/components/EventCard'; 
import { colors, globalStyles} from '@/styles/global'
import { getEvents, EventFilters } from '@/storage/eventAPI'

interface EventFeedProps {
  filtrosAtivos: EventFilters;
}

export default function EventFeed({ filtrosAtivos }: EventFeedProps) {
  // Estados para controlar os dados e a paginação
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // O mesmo limite padrão de 20 eventos do backend
  const limite = 20; 

  // Função que busca a próxima página de eventos
  const loadMoreEvents = async (resetPage = false) => {
    // Se resetPage for true, voltamos para a página 1 (útil para quando o filtro muda)
    const currentPage = resetPage ? 1 : page;
    
    // Evita requisições simultâneas se já estiver carregando ou se não houver mais dados
    if (loading || (!hasMore && !resetPage)) return;
    setLoading(true);

    try {
      // Chama a "API", passando a página atual e o limite
      const response = await getEvents(currentPage, limite, filtrosAtivos);

      setData((prevData) => {
        // Se for reset, substitui. Se for scroll, concatena.
        const newData = resetPage ? response.dados : [...prevData, ...response.dados];

        // Filtra duplicatas por ID (caso a API retorne algo que já temos)
        return newData.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      });

      setHasMore(response.dados.length === limite);
      if (!resetPage) setPage((p) => p + 1);
      
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega a primeira página assim que a tela abre
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadMoreEvents(true);
  }, [filtrosAtivos]);

  // Componente de Loading que aparece no final da lista
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={colors.bluePrimary}/>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        // O renderItem desenha o seu EventCard para cada item da lista
        renderItem={({ item }) => (
          <EventCard
            title={item.title}
            organizer={item.organizer}
            location={item.location}
            dates={item.dates}
            time={item.time}
            free={item.free}
          />
        )}
        // O Scroll Infinito acontece aqui:
        onEndReached={() => loadMoreEvents(false)}
        // Define o quão perto do final da lista o usuário precisa chegar para disparar o onEndReached. 
        // 0.2 significa "quando faltar 20% para chegar no fim, carregue mais".
        onEndReachedThreshold={0.2} 
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
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
});