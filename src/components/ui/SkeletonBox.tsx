import { useTheme } from '@/hooks/use-theme';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonBoxProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Bloco retangular animado que pulsa de opacidade
 * para representar conteúdo ainda carregando.
 */
export function SkeletonBox({ width, height = 16, borderRadius = 6, style }: SkeletonBoxProps) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.box,
        {
          opacity,
          width: width ?? '100%',
          height,
          borderRadius,
          backgroundColor: theme.backgroundElement,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  box: {},
});
