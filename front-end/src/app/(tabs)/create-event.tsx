import React, { useState } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useCreateEvent } from '../../hooks/useCreateEvent';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEventScreen() {
  const router = useRouter();

  // Estados para os campos do formulário
  const [title, setTitle] = useState('');
  const [local, setLocal] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  // Estados do DateTimePicker
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<any>(Platform.OS === 'ios' ? 'datetime' : 'date');

  const { createEvent, loading, error } = useCreateEvent();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        setDate(selectedDate);
        if (pickerMode === 'date') {
          // Após escolher a data no Android, abre o seletor de Hora
          setPickerMode('time');
        } else {
          // Terminou de escolher a hora
          setShowPicker(false);
          setPickerMode('date'); // Reseta para a próxima vez
        }
      } else {
        // Usuário cancelou
        setShowPicker(false);
        setPickerMode('date');
      }
    } else {
      // iOS atualiza em tempo real
      if (selectedDate) {
        setDate(selectedDate);
      }
    }
  };

  const handleCreateEvent = async () => {
    if (!title || !local || !duration || !category) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const isoDateString = date.toISOString();

      const eventoParaEnviar = {
        title,
        local,
        start_date: isoDateString,
        duration: Number(duration),
        category_id: Number(category),
      };

      await createEvent(eventoParaEnviar);
      
      Alert.alert('Sucesso', 'Evento criado com sucesso!');
      
      setTitle('');
      setLocal('');
      setDate(new Date());
      setDuration('');
      setCategory('');
      
      router.push('/(tabs)');
    } catch (err) {
      console.log('Falha ao criar evento');
    }
  };

  const formatDisplayDate = (d: Date) => {
    return d.toLocaleString('pt-BR', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.titulo}>Criar Evento</Text>
            <Text style={styles.subtitulo}>
              Preencha os dados abaixo para divulgar seu novo evento.
            </Text>
          </View>
          
          {/* Nome do Evento */}
          <Text style={styles.label}>Nome do Evento</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="text-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Festa da Computação"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Local */}
          <Text style={styles.label}>Local</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="location-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Pátio Principal"
              placeholderTextColor={colors.textSecondary}
              value={local}
              onChangeText={setLocal}
            />
          </View>

          {/* Data e Hora (Botão Picker Nativo) */}
          <Text style={styles.label}>Data e Hora</Text>
          <TouchableOpacity 
            style={styles.inputWrapper} 
            onPress={() => {
              setPickerMode(Platform.OS === 'ios' ? 'datetime' : 'date');
              setShowPicker(true);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <Text style={styles.input}>
              {formatDisplayDate(date)}
            </Text>
          </TouchableOpacity>

          {/* Renderização do Calendário */}
          {showPicker && (
            <DateTimePicker
              value={date}
              mode={pickerMode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              textColor={colors.textPrimaryDark}
            />
          )}

          {/* Duração */}
          <Text style={styles.label}>Duração (em minutos)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="time-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: 120"
              placeholderTextColor={colors.textSecondary}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
          </View>
          
          {/* Categoria (Estrutura provisória) */}
          <Text style={styles.label}>ID da Categoria</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="pricetag-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: 1 (Festa), 2 (Esporte)..."
              placeholderTextColor={colors.textSecondary}
              value={category}
              onChangeText={setCategory}
              keyboardType="numeric"
            />
          </View>

          {/* Mensagem de Erro (se houver) */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Botão de Criar */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateEvent}
            activeOpacity={0.85}
            disabled={loading}
          >
            <LinearGradient
              colors={[colors.orangePrimary, colors.orangePrimary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              {loading ? (
                <ActivityIndicator color={colors.backgroundDark} />
              ) : (
                <Text style={styles.createButtonText}>Publicar Evento</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
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
  label: {
    fontSize: 14,
    color: colors.textPrimaryDark,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarkSecondary,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimaryDark,
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: colors.orangePrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: colors.backgroundDark,
    fontSize: 17,
    fontWeight: 'bold',
  },
});