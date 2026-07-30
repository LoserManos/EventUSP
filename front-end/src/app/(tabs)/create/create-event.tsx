import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCreateEvent } from '@/hooks/useCreateEvent';
import DateTimePicker from '@react-native-community/datetimepicker';
import { eventsService, Category } from '@/services/eventService';
import { userService } from '@/services/userService';
import { Organization } from '@/types/org';
import { colors } from '@/styles/global';

const ACCENT = colors.orangePrimary;
const ACCENT_DARK = colors.orangePrimary;
const BG_COLOR = colors.backgroundDark;
const TEXT_MAIN = colors.textPrimaryDark;
const TEXT_MUTED = colors.textSecondary;
const INPUT_BG = colors.backgroundDarkSecondary;

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  party: 'Festa',
  sport: 'Esporte',
  workshop: 'Oficina',
  lecture: 'Palestra',
  congress: 'Congresso',
  social: 'Social',
  religion: 'Religião',
  academic: 'Acadêmico'
};

function Field({ label, icon, children }: { label: string; icon?: keyof typeof Ionicons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        {icon && <Ionicons name={icon} size={14} color={ACCENT_DARK} />}
        <Text style={styles.label}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

export default function CreateEventScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState<number | null>(null);
  const [local, setLocal] = useState('');
  const [description, setDescription] = useState('');
  const [free, setFree] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [userOrgs, setUserOrgs] = useState<Organization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  useEffect(() => {
    // Fetch categories
    eventsService.getCategories()
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setCategory(data[0].id);
        }
      })
      .catch((err) => console.error("Erro ao carregar categorias:", err))
      .finally(() => setLoadingCategories(false));

    // Fetch user orgs
    userService.getMe()
      .then(user => userService.getOrgs(user.id))
      .then(orgs => setUserOrgs(orgs))
      .catch(err => console.error("Erro ao carregar organizações:", err))
      .finally(() => setLoadingOrgs(false));
  }, []);

  // Date/Time
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<any>(Platform.OS === 'ios' ? 'datetime' : 'date');

  const { createEvent, loading, error } = useCreateEvent();

  const canPublish = title.trim().length > 0 && local.trim().length > 0 && duration.trim().length > 0 && category !== null;

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        setDate(selectedDate);
        if (pickerMode === 'date') {
          setPickerMode('time');
        } else {
          setShowPicker(false);
          setPickerMode('date');
        }
      } else {
        setShowPicker(false);
        setPickerMode('date');
      }
    } else {
      if (selectedDate) setDate(selectedDate);
    }
  };

  const handlePublish = async () => {
    if (!canPublish) return;

    try {
      const eventoParaEnviar = {
        title,
        local,
        start_date: date.toISOString(),
        duration: Number(duration) || 120, // default if empty/invalid
        category_id: category!,
        organization_id: organizationId,
      };

      await createEvent(eventoParaEnviar);
      
      Alert.alert('Sucesso', 'Evento publicado com sucesso!');
      router.push('/(tabs)');
    } catch (err) {
      console.log('Falha ao criar evento');
    }
  };

  const formatDisplayDate = (d: Date) => {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  const formatDisplayTime = (d: Date) => {
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >


        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Cabeçalho Original */}
          <View style={styles.pageHeader}>
            <Text style={styles.titulo}>Criar Evento</Text>
            <Text style={styles.subtitulo}>
              Preencha os dados abaixo para divulgar seu novo evento.
            </Text>
          </View>

          <View style={styles.formContent}>

            {/* Cover uploader */}
            {/* <TouchableOpacity style={styles.coverUploader} activeOpacity={0.9}>
              <View style={styles.coverIconCircle}>
                <Ionicons name="images-outline" size={20} color={ACCENT_DARK} />
              </View>
              <Text style={styles.coverText}>Adicionar foto de capa</Text>
              <Text style={styles.coverSubtext}>Recomendado 1200 × 600</Text>
            </TouchableOpacity> */}

            <Field label="Nome do evento" icon="text-outline">
              <TextInput
                style={styles.input}
                placeholder="Ex: Sexta do Rock"
                placeholderTextColor={TEXT_MUTED}
                value={title}
                onChangeText={setTitle}
              />
            </Field>

            <Field label="Duração (minutos)" icon="time-outline">
              <TextInput
                style={styles.input}
                placeholder="Ex: 120"
                placeholderTextColor={TEXT_MUTED}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
            </Field>

            {/* Organizador */}
            <Field label="Organizador" icon="people-outline">
              <View style={styles.categoriesWrapper}>
                {loadingOrgs ? (
                  <ActivityIndicator color={ACCENT_DARK} size="small" style={{ marginVertical: 8 }} />
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => setOrganizationId(null)}
                      style={[styles.categoryChip, { backgroundColor: organizationId === null ? ACCENT : INPUT_BG }]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.categoryChipText, { color: organizationId === null ? colors.backgroundDark : TEXT_MUTED }]}>
                        Eu mesmo
                      </Text>
                    </TouchableOpacity>
                    {userOrgs.map((org) => {
                      const active = org.id === organizationId;
                      return (
                        <TouchableOpacity
                          key={org.id}
                          onPress={() => setOrganizationId(org.id)}
                          style={[styles.categoryChip, { backgroundColor: active ? ACCENT : INPUT_BG }]}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.categoryChipText, { color: active ? colors.backgroundDark : TEXT_MUTED }]}>
                            {org.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                )}
              </View>
            </Field>

            {/* Category */}
            <Field label="Categoria">
              <View style={styles.categoriesWrapper}>
                {loadingCategories ? (
                  <ActivityIndicator color={ACCENT_DARK} size="small" style={{ marginVertical: 8 }} />
                ) : (
                  categories.map((c) => {
                    const active = c.id === category;
                    const label = CATEGORY_TRANSLATIONS[c.type] || c.type;
                    return (
                      <TouchableOpacity
                        key={c.id}
                        onPress={() => setCategory(c.id)}
                        style={[styles.categoryChip, { backgroundColor: active ? ACCENT : INPUT_BG }]}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.categoryChipText, { color: active ? colors.backgroundDark : TEXT_MUTED }]}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            </Field>

            {/* Date + Time */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Field label="Data" icon="calendar-outline">
                  <TouchableOpacity 
                    style={[styles.input, { justifyContent: 'center' }]} 
                    onPress={() => {
                      setPickerMode('date');
                      setShowPicker(true);
                    }}
                  >
                    <Text style={{ color: TEXT_MAIN }}>{formatDisplayDate(date)}</Text>
                  </TouchableOpacity>
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Horário" icon="time-outline">
                  <TouchableOpacity 
                    style={[styles.input, { justifyContent: 'center' }]} 
                    onPress={() => {
                      setPickerMode('time');
                      setShowPicker(true);
                    }}
                  >
                    <Text style={{ color: TEXT_MAIN }}>{formatDisplayTime(date)}</Text>
                  </TouchableOpacity>
                </Field>
              </View>
            </View>

            {showPicker && (
              <DateTimePicker
                value={date}
                mode={pickerMode}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}

            <Field label="Local" icon="location-outline">
              <TextInput
                style={styles.input}
                placeholder="Ex: Vala da FAUD-USP"
                placeholderTextColor={TEXT_MUTED}
                value={local}
                onChangeText={setLocal}
              />
            </Field>

            <Field label="Descrição">
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Conte mais sobre o seu evento..."
                placeholderTextColor={TEXT_MUTED}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </Field>

            {/* Free toggle */}
            <View style={styles.freeToggleWrapper}>
              <View>
                <Text style={styles.freeTitle}>Evento gratuito</Text>
                <Text style={styles.freeSubtext}>Sem custo de entrada</Text>
              </View>
              <Switch
                value={free}
                onValueChange={setFree}
                trackColor={{ false: '#d1d5db', true: ACCENT }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#d1d5db"
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </ScrollView>

        {/* Sticky publish */}
        <View style={styles.stickyFooter}>
          <TouchableOpacity
            style={[styles.publishButton, (!canPublish || loading) && styles.publishButtonDisabled]}
            onPress={handlePublish}
            disabled={!canPublish || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.backgroundDark} />
            ) : (
              <Text style={styles.publishButtonText}>Publicar evento</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  pageHeader: {
    marginBottom: 32,
    marginTop: 4,
  },
  titulo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.orangePrimary,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  formContent: {
    gap: 16,
    paddingTop: 4,
  },
  coverUploader: {
    height: 160,
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: ACCENT,
    backgroundColor: `${ACCENT}12`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  coverIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${ACCENT}30`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  coverText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: ACCENT_DARK,
  },
  coverSubtext: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 4,
  },
  fieldContainer: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontWeight: '700',
    fontSize: 13,
    color: TEXT_MAIN,
  },
  input: {
    width: '100%',
    backgroundColor: INPUT_BG,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: TEXT_MAIN,
    minHeight: 48,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  categoriesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryChipText: {
    fontWeight: '600',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  freeToggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: INPUT_BG,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: INPUT_BG,
    marginTop: 8,
  },
  freeTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: TEXT_MAIN,
  },
  freeSubtext: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 8,
  },
  stickyFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BG_COLOR,
    borderTopWidth: 1,
    borderTopColor: INPUT_BG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  publishButton: {
    width: '100%',
    backgroundColor: ACCENT,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  publishButtonDisabled: {
    opacity: 0.4,
  },
  publishButtonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.backgroundDark,
  },
});