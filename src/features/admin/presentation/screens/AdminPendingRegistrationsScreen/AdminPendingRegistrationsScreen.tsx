import React, { useCallback, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, Text, Avatar } from '../../../../../core/design-system';
import { FlashList } from '@shopify/flash-list';
import { useAdminStore } from '../../store/useAdminStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';
import { AdminHomeStackParamList } from '../../../../../app/navigation/admin/stacks/AdminHomeStack';
import { formatDate } from '../../../../../core/utils/date';

type NavigationProp = NativeStackNavigationProp<AdminHomeStackParamList>;

const PendingUserItem = ({ 
  item, 
  onPress 
}: { 
  item: { id: string; name: string; role: string; email: string }; 
  onPress: () => void 
}) => {
  const initials = item.name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Avatar 
        source={undefined} 
        size="md"
        initials={initials} 
      />
      <View style={styles.userInfo}>
        <Text variant="body" weight="bold" style={styles.userName}>
          {item.name}
        </Text>
        <Text variant="caption" color="text.secondary" style={styles.userRole}>
          {item.role}
        </Text>
        <Text variant="caption" color="text.secondary" style={styles.userEmail}>
          {item.email}
        </Text>
      </View>
      <View style={styles.statusDot} />
    </TouchableOpacity>
  );
};

export const AdminPendingRegistrationsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { 
    pendingUsers, 
    isLoading, 
    fetchPendingUsers,
    subscribeToRealtime,
    unsubscribeFromRealtime
  } = useAdminStore();

  useEffect(() => {
    return () => unsubscribeFromRealtime();
  }, [unsubscribeFromRealtime]);

  useFocusEffect(
    useCallback(() => {
      fetchPendingUsers();
      subscribeToRealtime();
    }, [fetchPendingUsers, subscribeToRealtime])
  );

  if (isLoading && pendingUsers.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScreenContainer scrollable={false} style={{ flex: 1 }} edges={['left', 'right']}>
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlashList
            data={pendingUsers}
            estimatedItemSize={90}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <PendingUserItem 
                item={item} 
                onPress={() => navigation.navigate('RegistrationDetails', {
                  userId: item.id,
                  name: item.name,
                  email: item.email,
                  role: item.role,
                  registrationDate: formatDate(item.createdAt),
                  department: item.department,
                  position: item.position,
                  phone: item.phone,
                })}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text variant="body" color="text.secondary">
                  Nenhum cadastro pendente.
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

