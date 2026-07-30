import HomeHeader from '@/components/HomeHeader';
import { colors, globalStyles } from '@/styles/global';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  StyleSheet,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { EventCard } from '@/components/EventCard';
import { SocialPost } from '@/components/SocialPost';
import { useFollowingEventsFeed } from '@/hooks/useFollowingEventsFeed';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

const images = [
  require('../../../assets/images/card3.jpg'),
  require('../../../assets/images/Card.png'),
];

// Legenda exibida sobre cada slide (deixe vazio '' para slides sem legenda)
const captions = ['Viva a USP', ''];

const minhaFoto = require('../../../assets/images/Event.png');

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const imageWidth = width - 40;
  const imageHeight = 200;
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const { data: followingEvents, loading } = useFollowingEventsFeed(20);

  const displayedEvents = showAllEvents ? followingEvents : followingEvents.slice(0, 2);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / imageWidth);
    setActiveIndex(index);
  };

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho com título e sino de notificações */}
      <HomeHeader />

      {/* Slider de imagens com legenda e indicadores */}
      <View style={styles.sliderWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
          contentContainerStyle={styles.sliderContent}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
        >
          {images.map((imageSource, index) => (
            <View key={index} style={{ width: imageWidth, height: imageHeight }}>
              <Image
                source={imageSource}
                style={[styles.sliderImage, { width: imageWidth, height: imageHeight }]}
                resizeMode="cover"
              />
              {captions[index] ? (
                <View style={styles.captionWrapper}>
                  <Text style={styles.captionText}>{captions[index]}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>

        {/* Indicadores (dots) */}
        <View style={styles.dotsWrapper}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Eventos em destaque */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Eventos de interesse</Text>
        {followingEvents.length > 0 && (
          <TouchableOpacity onPress={() => setShowAllEvents(!showAllEvents)}>
            <Text style={styles.sectionLink}>{showAllEvents ? 'Ver menos' : 'Ver todos'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {displayedEvents.length > 0 ? (
        displayedEvents.map(event => (
          <EventCard key={`featured-${event.id}`} event={event} />
        ))
      ) : (
        !loading && (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ color: colors.textSecondary, fontFamily: 'Montserrat_400Regular' }}>
              Nenhum evento encontrado de quem você segue.
            </Text>
          </View>
        )
      )}

      {loading && (
        <ActivityIndicator size="small" color={colors.orangePrimary} style={{ marginVertical: 12 }} />
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 110,
  },
  sliderWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  slider: {
    width: '100%',
  },
  sliderContent: {
    paddingHorizontal: 0,
  },
  sliderImage: {
    borderRadius: 16,
    marginHorizontal: 0,
  },
  captionWrapper: {
    position: 'absolute',
    left: 16,
    bottom: 4,
  },
  captionText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  dotsWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.orangePrimary,
    width: 20,
  },
  dotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textPrimaryDark,
  },
  sectionLink: {
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    color: colors.orangePrimary,
  },
});