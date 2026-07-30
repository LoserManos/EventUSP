import React from 'react';
import { FlatList, TouchableOpacity, Image, Text, View } from 'react-native';
import { UserOverlayModal } from '@/components/UserOverlayModal';
import { getImageUrl } from '@/utils/image';
import { globalStyles, colors } from '@/styles/global';

const orgPlaceholder = require('@/assets/images/LA.png');

export function UserOrgsModal({ visible, onClose, orgs, router }: any) {
  return (
    <UserOverlayModal visible={visible} onClose={onClose} title="Organizações">
      <FlatList
        data={orgs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const avatarUri = item.picture_profile ? getImageUrl(item.picture_profile) : null;
          return (
            <TouchableOpacity style={globalStyles.socialItemContainer} onPress={() => { onClose(); router.push(`/social/org/${item.id}`); }}>
              <Image source={avatarUri ? { uri: avatarUri } : orgPlaceholder} style={globalStyles.itemPicture} />
              <View style={globalStyles.itemInfoContainer}>
                <Text style={globalStyles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={globalStyles.empty} numberOfLines={2}>{item.description || "Sem descrição"}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={globalStyles.empty}>Nenhuma organização vinculada.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </UserOverlayModal>
  );
}