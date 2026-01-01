import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VacationStackParamList } from '../../../../../app/navigation/collaborator/stacks/VacationStack';
import { 
  ScreenContainer, 
  Text, 
  Spacer 
} from '../../../../../core/design-system';
import { styles } from './styles';
import { theme } from '../../../../../core/design-system/tokens';

type FilterType = 'Todos' | 'Pendentes' | 'Aprovadas' | 'Reprovadas';

const filters: FilterType[] = ['Todos', 'Pendentes', 'Aprovadas', 'Reprovadas'];

const vacationHistory = [
  { 
    id: '1', 
    title: 'Solicitação de Férias', 
    date: '20/07/2024 - 30/07/2024', 
    status: 'success' as const 
  },
  { 
    id: '2', 
    title: 'Solicitação de Férias', 
    date: '15/05/2024 - 25/05/2024', 
    status: 'success' as const 
  },
  { 
    id: '3', 
    title: 'Solicitação de Férias', 
    date: '01/03/2024 - 10/03/2024', 
    status: 'success' as const 
  },
  { 
    id: '4', 
    title: 'Solicitação de Férias', 
    date: '10/01/2024 - 20/01/2024', 
    status: 'success' as const 
  },
];

type NavigationProp = NativeStackNavigationProp<VacationStackParamList, 'VacationHistory'>;

export const VacationHistoryScreen = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');
  const navigation = useNavigation<NavigationProp>();

  const renderFilter = (filter: FilterType) => {
    const isActive = activeFilter === filter;
    // Using a light grey for inactive and a slightly darker one for active based on prototype
    const backgroundColor = isActive ? '#E0E0E0' : '#F0F2F5'; 
    
    return (
      <TouchableOpacity
        key={filter}
        style={[styles.filterItem, { backgroundColor }]}
        onPress={() => setActiveFilter(filter)}
      >
        <Text variant="body" weight={isActive ? 'bold' : 'regular'}>
          {filter}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer scrollable={false} style={{ flex: 1 }} edges={['left', 'right']}>
      <View style={styles.container}>
        <View>
            <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContentContainer}
            >
            {filters.map(renderFilter)}
            </ScrollView>
        </View>

        <FlatList
          data={vacationHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.vacationItem}
              onPress={() => navigation.navigate('VacationRequestDetails', { id: item.id })}
            >
              <View style={styles.vacationContent}>
                <Text variant="body" weight="bold">
                  {item.title}
                </Text>
                <Spacer size="xs" />
                <Text variant="body" color="primary">
                  {item.date}
                </Text>
              </View>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: theme.colors.status[item.status] }
                ]} 
              />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <Spacer size="lg" />}
          contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        />
      </View>
    </ScreenContainer>
  );
};
