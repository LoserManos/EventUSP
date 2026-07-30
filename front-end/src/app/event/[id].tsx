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

  UIManager,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useFetchUser } from '@/hooks/useFetchUser';
import { getImageUrl } from '@/utils/image';
import { colors } from '@/styles/global';

const ACCENT = colors.orangePrimary;
const ACCENT_DARK = '#d9971c';
const DEFAULT_COVER = require('../../../assets/images/Card.png');
const DEFAULT_AVATAR = require('@/assets/images/LA.png');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function InfoRow({ icon, label, value, onPress }: { icon: any; label: string; value: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.infoRowContainer} onPress={onPress} disabled={!onPress}>
      <View style={styles.infoRowIconBox}>
        <MaterialCommunityIcons name={icon} size={20} color={ACCENT_DARK} />
      </View>
      <View style={styles.infoRowTexts}>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={styles.infoRowValue} numberOfLines={1}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { event, likers, interested, comments, author, organization, loading, 
          toggleLike, toggleInterest, addComment, deleteEvent, updateEvent, uploadImage, uploadBanner } = useEventDetails(id as string);
  const { user: currentUser } = useFetchUser();
  const [going, setGoing] = useState(false);
  
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [localLikers, setLocalLikers] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");

  const isOwner = Boolean(currentUser?.id && event?.user_id && Number(currentUser.id) === Number(event.user_id));

  // Edit Event State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editLocal, setEditLocal] = useState("");
  const [editDuration, setEditDuration] = useState("");


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

  const handleDeleteEvent = () => {
    Alert.alert(
      "Excluir Evento",
      "Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteEvent();
              router.back();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o evento.");
            }
          }
        }
      ]
    );
  };

  const handleOpenEdit = () => {
    if (!event) return;
    router.push(`/event/edit/${id}`);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: uri.split('/').pop() || 'banner.jpg',
        type: 'image/jpeg',
      } as any);

      try {
        await uploadBanner(formData);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível enviar a imagem.");
      }
    }
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

  const dateObj = new Date(event.start_date);
  const formattedDate = dateObj.toLocaleDateString('pt-BR');
  const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const organizerName = organization ? organization.name : (author ? author.name : "Comunidade USP");
  const isFree = true;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.coverContainer}>
          <Image source={event.banner ? { uri: getImageUrl(event.banner)! } : DEFAULT_COVER} style={styles.coverImage} />
          
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
            style={styles.gradientOverlay}
          />

          <SafeAreaView style={styles.topControls}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.rightControls}>
              {isOwner && (
                <>
                  <TouchableOpacity onPress={handleOpenEdit} style={styles.iconButton}>
                    <MaterialCommunityIcons name="pencil" size={22} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDeleteEvent} style={styles.iconButton}>
                    <MaterialCommunityIcons name="delete" size={22} color="#ff4444" />
                  </TouchableOpacity>
                </>
              )}
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

          <View style={styles.titleContainer}>
            {isFree && (
              <View style={styles.badgeFree}>
                <Text style={styles.badgeFreeText}>Gratuito</Text>
              </View>
            )}
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <View style={styles.quickFactsGrid}>
            <View style={styles.gridColumn}>
              <InfoRow icon="calendar-month" label="Data" value={formattedDate} />
              <InfoRow icon="map-marker" label="Local" value={event.local} />
            </View>
            <View style={styles.gridColumn}>
              <InfoRow icon="clock-outline" label="Horário" value={formattedTime} />
              <InfoRow 
                icon="account-tie" 
                label="Organizador" 
                value={organizerName} 
                onPress={() => {
                  if (organization) {
                    router.push(`/social/org/${organization.id}`);
                  } else if (author) {
                    router.push(`/social/user/${author.id}`);
                  }
                }}
              />
            </View>
          </View>

          <View style={styles.attendeesBox}>
            <TouchableOpacity style={styles.attendeesLeft} onPress={() => setIsModalVisible(true)}>
              <View style={styles.avatarsRow}>
                {localLikers.slice(0, 3).map((user, index) => (
                  <Image 
                    key={user.id}
                    source={user.picture_profile ? { uri: getImageUrl(user.picture_profile)! } : DEFAULT_AVATAR} 
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o evento</Text>
            <Text style={styles.descriptionText}>
              Junte-se a nós no {event.title}! Um evento imperdível organizado por {organizerName}, 
              com muita cultura, música e diversão para a comunidade USP. Traga seus amigos e viva essa experiência.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comentários ({comments.length})</Text>
            
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

            {comments.map((comment) => (
              <TouchableOpacity 
                key={comment.id} 
                style={styles.commentRow}
                onPress={() => router.push(`/social/user/${comment.author.id}`)}
              >
                <Image source={comment.author.picture_profile ? { uri: getImageUrl(comment.author.picture_profile)! } : DEFAULT_AVATAR} style={styles.commentAvatar} />
                <View style={styles.commentBubble}>
                  <Text style={styles.commentAuthor}>{comment.author.nickname}</Text>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              </TouchableOpacity>
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
                <TouchableOpacity 
                  style={styles.modalUserRow}
                  onPress={() => {
                    setIsModalVisible(false);
                    router.push(`/social/user/${item.id}`);
                  }}
                >
                  <Image source={item.picture_profile ? { uri: getImageUrl(item.picture_profile)! } : DEFAULT_AVATAR} style={styles.modalUserImg} />
                  <View>
                    <Text style={styles.modalUserName}>{item.name}</Text>
                    <Text style={styles.modalUserNickname}>@{item.nickname}</Text>
                  </View>
                </TouchableOpacity>
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
    width: 84,
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
    fontSize: 14,
    lineHeight: 20,
  },
  uploadImageBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 24,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundDarkSecondary,
  },
  editHeaderBtn: {
    padding: 4,
    minWidth: 70,
  },
  editHeaderCancelText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  editHeaderTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 17,
    color: colors.textPrimaryDark,
  },
  editHeaderSaveText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: colors.orangePrimary,
    textAlign: 'right',
  },
  editFormContainer: {
    flex: 1,
  },
  editFormContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  editCoverUploader: {
    height: 160,
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.orangePrimary,
    backgroundColor: 'rgba(252, 185, 40, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  editCoverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  editCoverIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(252, 185, 40, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  editCoverText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: colors.orangePrimary,
  },
  editCoverSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  editFieldsContainer: {
    gap: 16,
  },
  editField: {
    gap: 6,
  },
  editFieldLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.textPrimaryDark,
  },
  editInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  editInputFlex: {
    flex: 1,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: colors.textPrimaryDark,
  },
  editStickyFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundDarkSecondary,
  },
  editStickySaveBtn: {
    backgroundColor: colors.orangePrimary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  editStickySaveBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: colors.backgroundDark,
  }
});
