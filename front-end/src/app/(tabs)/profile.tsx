import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import UserProfilePage from './social/user/[id]';
import { useAuth } from '@/contexts/AuthContext';
import { globalStyles, colors } from '@/styles/global';

export default function ProfileTab() {
  const { userProfile } = useAuth();

  if (!userProfile?.id) {
    return (
      <View style={[globalStyles.container, globalStyles.centered]}>
        <ActivityIndicator size="large" color={colors.orangePrimary} />
      </View>
    );
  }

  // Reuse the exact same Profile page, but inject our own logged in ID
  return <UserProfilePage userId={userProfile.id} />;
}
