import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, Text, Avatar, FilterList, Icon } from '../../../../../core/design-system';
import { FlashList } from '@shopify/flash-list';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';
import { AdminUsersStackParamList } from '../../../../../app/navigation/admin/stacks/AdminUsersStack';

type NavigationProp = NativeStackNavigationProp<AdminUsersStackParamList>;

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Colaborador' | 'Gestor' | 'Administrador';
  status?: 'Ativo' | 'Inativo';
  createdAt?: string;
}

// Dados estáticos baseados no protótipo - apenas usuários ativos
const ALL_USERS: User[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'colaborador@email.com',
    role: 'Colaborador',
    status: 'Ativo',
    createdAt: '15 de março de 2023',
  },
  {
    id: '2',
    name: 'Ana Souza',
    email: 'gestor@email.com',
    role: 'Gestor',
    status: 'Ativo',
    createdAt: '15 de março de 2023',
  },
  {
    id: '3',
    name: 'Pedro Almeida',
    email: 'admin@email.com',
    role: 'Administrador',
    status: 'Ativo',
    createdAt: '15 de março de 2023',
  },
  {
    id: '4',
    name: 'Mariana Costa',
    email: 'colaborador2@email.com',
    role: 'Colaborador',
    status: 'Ativo',
    createdAt: '15 de março de 2023',
  },
  {
    id: '5',
    name: 'Ricardo Pereira',
    email: 'ricardo.almeida@email.com',
    role: 'Colaborador',
    status: 'Ativo',
    createdAt: '15 de março de 2023',
  },
  {
    id: '6',
    name: 'Fernanda Lima',
    email: 'admin2@email.com',
    role: 'Administrador',
    status: 'Ativo',
    createdAt: '15 de março de 2023',
  },
];

const FILTERS = ['Todos', 'Colaboradores', 'Gestores', 'Adm'];

const UserItem = ({ item, onPress }: { item: User; onPress: () => void }) => {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredUsers = useMemo(() => {
    let filtered = ALL_USERS;

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
  }, [searchQuery, activeFilter]);

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
            renderItem={({ item }) => (
              <UserItem 
                item={item} 
                onPress={() => navigation.navigate('UserDetails', {
                  userId: item.id,
                  name: item.name,
                  email: item.email,
                  role: item.role,
                  status: item.status || 'Ativo',
                  createdAt: item.createdAt || '',
                })}
              />
            )}
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
