// src/app/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { globalStyles } from '@/styles/global';
import SearchBar from '@/components/SearchBar';
import { UserFeed } from '@/components/UserFeed';
import { OrgFeed } from '@/components/OrgFeed';

export default function SocialPage() {
  const [type, setType] = useState<'user' | 'org'>('user');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.header, {marginTop: 20}]}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          placeholder={`Buscar ${type === 'user' ? 'usuários' : 'organizações'}...`} 
        />
      </View>

      {/* Botões de Seleção de Abas */}
      <View style={globalStyles.buttonsTab}>
        <TouchableOpacity 
          style={[globalStyles.interactionButton,
                  globalStyles.pressedInteractionButton,
                  type === 'user' && globalStyles.orangeInteractionButton]} 
          onPress={() => { setType('user'); setSearchQuery(''); }}
        >
          <Text style={[globalStyles.interactionButtonText,
                        globalStyles.pressedInteractionText,
                        type === 'user' && globalStyles.primaryInteractionText]}>Usuários</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[globalStyles.interactionButton,
                  globalStyles.pressedInteractionButton,
                  type === 'org' && globalStyles.orangeInteractionButton]} 
          onPress={() => { setType('org'); setSearchQuery(''); }}
        >
          <Text style={[globalStyles.interactionButtonText,
                        globalStyles.pressedInteractionText,
                        type === 'org' && globalStyles.primaryInteractionText]}>Organizações</Text>
        </TouchableOpacity>
      </View>

      {/* Renderização Condicional dos Feeds */}
      {type === 'user' ? (
        <UserFeed searchQuery={searchQuery} />
      ) : (
        <OrgFeed searchQuery={searchQuery} />
      )}
    </View>
  );
}