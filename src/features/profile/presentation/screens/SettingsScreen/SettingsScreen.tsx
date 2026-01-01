import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { 
  ScreenContainer, 
  ProfileHeader, 
  ListSection, 
  Text, 
  Icon, 
  Button, 
  Spacer 
} from '../../../../../core/design-system';
import { useAuthStore } from '../../../../auth/presentation/store/useAuthStore';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';
import { IconName } from '../../../../../core/design-system/atoms/Icon/types';

export const SettingsScreen = () => {
  const { user, signOut } = useAuthStore();

  const menuGroups = [
    {
      title: 'Minha Conta',
      items: [
        { id: 'personal_data', icon: 'account-outline', label: 'Meus Dados', onPress: () => {} },
        { id: 'password', icon: 'lock-outline', label: 'Alterar Senha', onPress: () => {} },
      ]
    },
    {
      title: 'Configurações',
      items: [
        { id: 'notifications', icon: 'bell-outline', label: 'Notificações', onPress: () => {} },
        { id: 'help', icon: 'help-circle-outline', label: 'Ajuda', onPress: () => {} },
      ]
    }
  ];

  const renderMenuItem = (item: { id: string, icon: string, label: string, onPress: () => void }) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemIcon}>
        <Icon name={item.icon as IconName} size={24} color="text.secondary" />
      </View>
      <View style={styles.menuItemContent}>
        <Text variant="body" color="text.primary">
          {item.label}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="text.disabled" />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer scrollable edges={['left', 'right']}>
      <View style={styles.container}>
        <ProfileHeader
          name={user?.name || 'Usuário'}
          role={user?.role || 'Colaborador'}
          avatarUrl={user?.avatar}
        />

        <Spacer size="lg" />

        {menuGroups.map((group, index) => (
          <View key={group.title}>
            <ListSection title={group.title}>
              {group.items.map(renderMenuItem)}
            </ListSection>
            {index < menuGroups.length - 1 && <Spacer size="lg" />}
          </View>
        ))}

        <View style={styles.logoutButtonContainer}>
          <Button 
            title="Sair" 
            variant="outline" 
            onPress={signOut}
            leftIcon="logout"
            style={{ borderColor: theme.colors.status.error }}
            textStyle={{ color: theme.colors.status.error }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
