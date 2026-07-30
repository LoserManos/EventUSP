import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useCreateEvent } from '@/hooks/useCreateEvent';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEventScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [local, setLocal] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<any>(Platform.OS === 'ios' ? 'datetime' : 'date');

  const { createEvent, loading, error } = useCreateEvent();

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
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={globalStyles.infoForm}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabeçalho */}
          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.title}>Criar Evento</Text>
            <Text style={globalStyles.secondaryText}>
              Preencha os dados abaixo para divulgar seu novo evento.
            </Text>
          </View>
          
          {/* Nome do Evento */}
          <Text style={globalStyles.label}>Nome do Evento</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="text-outline" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Ex: Festa da Computação"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Local */}
          <Text style={globalStyles.label}>Local</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Ex: Pátio Principal"
              placeholderTextColor={colors.textSecondary}
              value={local}
              onChangeText={setLocal}
            />
          </View>

          {/* Data e Hora */}
          <Text style={globalStyles.label}>Data e Hora</Text>
          <TouchableOpacity 
            style={[globalStyles.input, { flexDirection: 'row', alignItems: 'center' }]} 
            onPress={() => {
              setPickerMode(Platform.OS === 'ios' ? 'datetime' : 'date');
              setShowPicker(true);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <Text style={[globalStyles.primaryText, { fontSize: 12, flex: 1 }]}>
              {formatDisplayDate(date)}
            </Text>
          </TouchableOpacity>

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
          <Text style={globalStyles.label}>Duração (em minutos)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Ex: 120"
              placeholderTextColor={colors.textSecondary}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
          </View>
          
          {/* Categoria */}
          <Text style={globalStyles.label}>ID da Categoria</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="pricetag-outline" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Ex: 1 (Festa), 2 (Esporte)..."
              placeholderTextColor={colors.textSecondary}
              value={category}
              onChangeText={setCategory}
              keyboardType="numeric"
            />
          </View>

          {error && <Text style={{ color: colors.redWarning, fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>{error}</Text>}

          {/* Botão de Criar */}
          <TouchableOpacity
            style={globalStyles.formSaveButton}
            onPress={handleCreateEvent}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.backgroundDark} />
            ) : (
              <Text style={globalStyles.formSaveButtonText}>Publicar Evento</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}