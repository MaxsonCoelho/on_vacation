import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, Text, Avatar, FilterList, Icon } from '../../../../../core/design-system';
import { FlashList } from '@shopify/flash-list';
import { useAdminStore } from '../../store/useAdminStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';
import { AdminUsersStackParamList } from '../../../../../app/navigation/admin/stacks/AdminUsersStack';
import { formatDate } from '../../../../../core/utils/date';

type NavigationProp = NativeStackNavigationProp<AdminUsersStackParamList>;

const FILTERS = ['Todos', 'Colaboradores', 'Gestores', 'Adm'];

const UserItem = ({ 
  item, 
  onPress 
}: { 
  item: { id: string; name: string; email: string; role: string; avatarUrl?: string }; 
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
        source={item.avatarUrl} 
        size="md"
        initials={initials} 
      />
      <View style={styles.userInfo}>
        <Text variant="body" weight="bold" style={styles.userName}>
          {item.name}
        </Text>
        <Text variant="caption" color="text.secondary" style={styles.userEmail}>
          {item.email}
        </Text>
      </View>
      <View style={styles.statusDot} />
    </TouchableOpacity>
  );
};

export const AdminUsersScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { 
    users, 
    isLoading, 
    fetchUsers,
    subscribeToRealtime,
    unsubscribeFromRealtime
  } = useAdminStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    return () => unsubscribeFromRealtime();
  }, [unsubscribeFromRealtime]);

  useFocusEffect(
    useCallback(() => {
      // Sempre busca do remoto quando focar na tela (se online) para sincronizar
      fetchUsers(activeFilter);
      subscribeToRealtime();
    }, [fetchUsers, subscribeToRealtime, activeFilter])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers(activeFilter);
    setRefreshing(false);
  }, [fetchUsers, activeFilter]);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Aplicar filtro de role
    if (activeFilter !== 'Todos') {
      const roleMap: Record<string, string> = {
        'Colaboradores': 'Colaborador',
        'Gestores': 'Gestor',
        'Adm': 'Administrador',
      };
      const roleFilter = roleMap[activeFilter];
      if (roleFilter) {
        filtered = filtered.filter(user => user.role === roleFilter);
      }
    }

    // Aplicar busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, activeFilter, users]);

  if (isLoading && users.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScreenContainer scrollable={false} style={{ flex: 1 }} edges={['left', 'right']}>
      <View style={styles.container}>
        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <View style={styles.searchIconContainer}>
              <Icon name="magnify" size={20} color="text.secondary" />
            </View>
            <TextInput
              placeholder="Buscar usuário"
              placeholderTextColor={theme.colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Filtros */}
        <FilterList
          filters={FILTERS}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          style={styles.filters}
        />

        {/* Lista de Usuários */}
        <View style={styles.listContainer}>
          <FlashList
            data={filteredUsers}
            estimatedItemSize={70}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => {
              // Formatar data de criação
              const formattedDate = item.createdAt 
                ? formatDate(item.createdAt)
                : '';
              
              return (
                <UserItem 
                  item={item} 
                  onPress={() => navigation.navigate('UserDetails', {
                    userId: item.id,
                    name: item.name,
                    email: item.email,
                    role: item.role,
                    status: item.status === 'active' ? 'Ativo' : 'Inativo',
                    createdAt: formattedDate || 'Data não disponível',
                  })}
                />
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text variant="body" color="text.secondary">
                  Nenhum usuário encontrado.
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
