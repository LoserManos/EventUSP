import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
  TextInput,
  Platform,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useFetchUser } from '@/hooks/useFetchUser';
import { colors } from '@/styles/global';

const ACCENT = colors.orangePrimary;
const ACCENT_DARK = '#d9971c';
const DEFAULT_COVER = require('../../../assets/images/Card.png');
const DEFAULT_AVATAR = require('../../../assets/images/default_avatar.jpg');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.infoRowContainer}>
      <View style={styles.infoRowIconBox}>
        <MaterialCommunityIcons name={icon} size={20} color={ACCENT_DARK} />
      </View>
      <View style={styles.infoRowTexts}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { event, likers, interested, comments, loading, toggleLike, toggleInterest, addComment } = useEventDetails(id as string);
  const { user: currentUser } = useFetchUser();
  const [going, setGoing] = useState(false);
  
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [localLikers, setLocalLikers] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (event && currentUser) {
      const isLiked = likers.some(u => u.id === currentUser.id);
      setLiked(isLiked || false);
      setLikesCount(event.likes || 0);
      setLocalLikers(likers);

      const isInterested = interested.some(u => u.id === currentUser.id);
      setGoing(isInterested || false);
    }
  }, [event, likers, interested, currentUser]);

  const handleToggleInterest = async () => {
    setGoing(!going);
    await toggleInterest();
  };

  const handleToggleLike = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const isNowLiked = !liked;
    setLiked(isNowLiked);
    setLikesCount(prev => isNowLiked ? prev + 1 : prev - 1);
    
    if (isNowLiked && currentUser) {
      setLocalLikers(prev => [currentUser, ...prev]);
    } else if (!isNowLiked && currentUser) {
      setLocalLikers(prev => prev.filter(u => u.id !== currentUser.id));
    }
    await toggleLike();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment(newComment);
    setNewComment("");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ACCENT_DARK} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'white' }}>Evento não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: ACCENT }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Formatação de data/hora
  const dateObj = new Date(event.start_date);
  const formattedDate = dateObj.toLocaleDateString('pt-BR');
  const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const organizer = "Comunidade USP"; // Temporário
  const isFree = true; // Temporário

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} bounces={false} showsVerticalScrollIndicator={false}>
        {/* Cover Section */}
        <View style={styles.coverContainer}>
          <Image source={DEFAULT_COVER} style={styles.coverImage} />
          
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
            style={styles.gradientOverlay}
          />

          {/* Top Controls */}
          <SafeAreaView style={styles.topControls}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.rightControls}>
              <TouchableOpacity onPress={handleToggleInterest} style={styles.iconButton}>
                <MaterialCommunityIcons 
                  name={going ? "bookmark" : "bookmark-outline"} 
                  size={22} 
                  color={going ? ACCENT_DARK : "#ffffff"} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialCommunityIcons name="share-variant" size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Title on Cover */}
          <View style={styles.titleContainer}>
            {isFree && (
              <View style={styles.badgeFree}>
                <Text style={styles.badgeFreeText}>Gratuito</Text>
              </View>
            )}
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.organizerCoverRow}>
              <MaterialCommunityIcons name="account-group" size={16} color="white" />
              <Text style={styles.organizerCoverText}>{organizer}</Text>
            </View>
          </View>
        </View>

        {/* Body Content */}
        <View style={styles.bodyContainer}>
          
          {/* Quick Facts Grid */}
          <View style={styles.quickFactsGrid}>
            <View style={styles.gridColumn}>
              <InfoRow icon="calendar-month" label="Data" value={formattedDate} />
              <InfoRow icon="map-marker" label="Local" value={event.local} />
            </View>
            <View style={styles.gridColumn}>
              <InfoRow icon="clock-outline" label="Horário" value={formattedTime} />
              <InfoRow icon="account-tie" label="Organizador" value={organizer} />
            </View>
          </View>

          {/* Attendees */}
          <View style={styles.attendeesBox}>
            <TouchableOpacity style={styles.attendeesLeft} onPress={() => setIsModalVisible(true)}>
              <View style={styles.avatarsRow}>
                {localLikers.slice(0, 3).map((user, index) => (
                  <Image 
                    key={user.id}
                    source={user.picture_profile ? { uri: user.picture_profile } : DEFAULT_AVATAR} 
                    style={[styles.avatarImg, { marginLeft: index > 0 ? -12 : 0, zIndex: 3 - index }]} 
                  />
                ))}
              </View>
              <Text style={styles.attendeesText}>
                <Text style={{ fontWeight: 'bold', color: '#ffffff' }}>{likesCount}</Text> curtiram esse evento
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleToggleLike}
              style={[styles.likeButton, liked && { backgroundColor: `${ACCENT}33` }]}
            >
              <MaterialCommunityIcons 
                name={liked ? "heart" : "heart-outline"} 
                size={18} 
                color={liked ? ACCENT_DARK : "#ffffff"} 
              />
              <Text style={[styles.likeButtonText, liked && { color: ACCENT_DARK }]}>
                {likesCount}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o evento</Text>
            <Text style={styles.descriptionText}>
              Junte-se a nós no {event.title}! Um evento imperdível organizado pela {organizer}, 
              com muita cultura, música e diversão para a comunidade USP. Traga seus amigos e viva essa experiência.
            </Text>
          </View>

          {/* Comments */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comentários ({comments.length})</Text>
            
            {/* Comment Input */}
            <View style={styles.commentInputRow}>
              <TextInput 
                style={styles.commentInput} 
                placeholder="Adicione um comentário..." 
                placeholderTextColor="#9ca3af"
                value={newComment}
                onChangeText={setNewComment}
                onSubmitEditing={handleAddComment}
              />
              <TouchableOpacity style={styles.commentSendBtn} onPress={handleAddComment}>
                <MaterialCommunityIcons name="send" size={20} color={ACCENT} />
              </TouchableOpacity>
            </View>

            {/* Comment List */}
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentRow}>
                <Image source={comment.author.picture_profile ? { uri: comment.author.picture_profile } : DEFAULT_AVATAR} style={styles.commentAvatar} />
                <View style={styles.commentBubble}>
                  <Text style={styles.commentAuthor}>{comment.author.nickname}</Text>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>


      {/* Modal de Interessados */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Curtiram esse evento ({likesCount})</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={localLikers}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.modalUserRow}>
                  <Image source={item.picture_profile ? { uri: item.picture_profile } : DEFAULT_AVATAR} style={styles.modalUserImg} />
                  <View>
                    <Text style={styles.modalUserName}>{item.name}</Text>
                    <Text style={styles.modalUserNickname}>@{item.nickname}</Text>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    height: 350,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topControls: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30,30,30,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  rightControls: {
    flexDirection: 'row',
    gap: 12,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  badgeFree: {
    backgroundColor: `${ACCENT}25`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  badgeFreeText: {
    color: ACCENT_DARK,
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
  },
  eventTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  organizerCoverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  organizerCoverText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  bodyContainer: {
    padding: 20,
    backgroundColor: colors.backgroundDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  quickFactsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridColumn: {
    flex: 1,
    gap: 16,
  },
  infoRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoRowIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${ACCENT}25`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRowTexts: {
    flex: 1,
  },
  infoRowLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  infoRowValue: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'Montserrat_700Bold',
  },
  attendeesBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  attendeesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarsRow: {
    flexDirection: 'row',
    width: 84, // Largura fixa
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.backgroundDarkSecondary,
  },
  attendeesText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#9ca3af',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  likeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: '#d1d5db',
    lineHeight: 24,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18,18,18,0.95)',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30, // SafeArea padding
    borderTopWidth: 1,
    borderColor: '#374151',
  },
  ctaButton: {
    backgroundColor: ACCENT,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#0a3540',
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.backgroundDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Montserrat_700Bold',
  },
  modalUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalUserImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  modalUserName: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalUserNickname: {
    fontSize: 13,
    color: '#9ca3af',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 4,
  },
  commentInput: {
    flex: 1,
    color: '#ffffff',
    height: 40,
  },
  commentSendBtn: {
    padding: 8,
  },
  commentRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: colors.backgroundDarkSecondary,
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4,
  },
  commentAuthor: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentContent: {
    color: '#d1d5db',
    lineHeight: 20,
  },
});
