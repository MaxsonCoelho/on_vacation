import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Text } from '../Text';
import { theme } from '../../tokens';
import { ProfileTagProps } from './types';
import { styles } from './styles';

export const ProfileTag: React.FC<ProfileTagProps> = ({ role }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação de brilho contínua (mais rápida e visível)
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Animação de pulso suave
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();
    pulseAnimation.start();

    return () => {
      shimmerAnimation.stop();
      pulseAnimation.stop();
    };
  }, [shimmerAnim, opacityAnim]);

  const getRoleConfig = () => {
    switch (role) {
      case 'Colaborador':
        return {
          color: theme.colors.brand.collaborator,
          label: 'Colaborador',
          lightColor: '#FFFFFF',
          shimmerColor: '#80B3FF',
        };
      case 'Gestor':
        return {
          color: theme.colors.brand.manager,
          label: 'Gestor',
          lightColor: '#FFFFFF',
          shimmerColor: '#66FF80',
        };
      case 'Administrador':
        return {
          color: theme.colors.brand.admin,
          label: 'Admin',
          lightColor: '#FFFFFF',
          shimmerColor: '#FFCC99',
        };
      default:
        return {
          color: theme.colors.primary,
          label: role,
          lightColor: '#FFFFFF',
          shimmerColor: theme.colors.primaryLight,
        };
    }
  };

  const config = getRoleConfig();
  
  // Animação de brilho que passa da esquerda para direita
  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  // Opacidade do brilho (mais intenso no meio)
  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.3, 0.5, 0.7, 1],
    outputRange: [0, 0.8, 1, 0.8, 0],
  });

  // Escala do brilho para dar mais profundidade
  const shimmerScale = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.color,
          opacity: opacityAnim,
        },
      ]}
    >
      {/* Base color */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: config.color,
            borderRadius: 16,
          },
        ]}
      />
      
      {/* Efeito de brilho animado que passa horizontalmente */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '50%',
            backgroundColor: config.shimmerColor,
            opacity: shimmerOpacity,
            transform: [
              {
                translateX: shimmerTranslateX,
              },
            ],
            borderRadius: 16,
          },
        ]}
      />
      
      {/* Brilho superior suave */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            backgroundColor: config.lightColor,
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 0.4, 0.6, 1],
              outputRange: [0.15, 0.35, 0.35, 0.15],
            }),
            borderRadius: 16,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          },
        ]}
      />
      
      {/* Overlay final para manter a cor de fundo */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: config.color,
            borderRadius: 16,
            opacity: 0.7,
          },
        ]}
      />
      
      {/* Texto da tag */}
      <Text
        variant="caption"
        weight="bold"
        style={[styles.label, { color: theme.colors.text.inverse }]}
      >
        {config.label}
      </Text>
    </Animated.View>
  );
};

