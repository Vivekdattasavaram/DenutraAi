import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashCard } from '../constants/OralHealthFlashcards';

interface FlashCardProps {
  card: FlashCard;
  width?: number;
}

const COLOR_STYLES: Record<FlashCard['color'], any> = {
  blue: {
    container: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
    title: { color: '#1D4ED8' },
    text: { color: '#1E3A8A' },
    icon: { color: '#0EA5E9' },
  },
  green: {
    container: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
    title: { color: '#166534' },
    text: { color: '#14532D' },
    icon: { color: '#22C55E' },
  },
  amber: {
    container: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
    title: { color: '#B45309' },
    text: { color: '#92400E' },
    icon: { color: '#D97706' },
  },
  purple: {
    container: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
    title: { color: '#6D28D9' },
    text: { color: '#4C1D95' },
    icon: { color: '#8B5CF6' },
  },
  red: {
    container: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
    title: { color: '#B91C1C' },
    text: { color: '#991B1B' },
    icon: { color: '#EF4444' },
  },
  cyan: {
    container: { backgroundColor: '#ECFEFF', borderColor: '#A5F3FC' },
    title: { color: '#155E75' },
    text: { color: '#0F172A' },
    icon: { color: '#06B6D4' },
  },
  indigo: {
    container: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
    title: { color: '#4338CA' },
    text: { color: '#312E81' },
    icon: { color: '#4F46E5' },
  },
  rose: {
    container: { backgroundColor: '#FFF1F2', borderColor: '#FBCFE8' },
    title: { color: '#9D174D' },
    text: { color: '#831843' },
    icon: { color: '#E11D48' },
  },
};

export const FlashCardComponent: React.FC<FlashCardProps> = ({
  card,
  width = 280,
}) => {
  const color = COLOR_STYLES[card.color];

  const typeEmojis: Record<FlashCard['type'], string> = {
    tip: '💡',
    myth: '⚠️',
    fact: '🧠',
    hygiene: '✨',
    prevention: '🛡️',
    awareness: '⚠️',
    gum: '❤️',
    brushing: '🪥',
  };

  return (
    <View style={[styles.card, { width }, color.container]}>
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, color.container]}> 
          <Text style={[styles.iconText, color.icon]}>
            {typeEmojis[card.type]}
          </Text>
        </View>
        <Text style={[styles.typeLabel, color.title]}>
          {card.type.replace('_', ' ')}
        </Text>
      </View>

      <Text style={[styles.title, color.title]}>{card.title}</Text>
      <Text style={[styles.bodyText, color.text]}>{card.content}</Text>

      {card.personalized && (
        <View style={styles.personalizedBadge}>
          <Text style={[styles.personalizedText, color.icon]}>
            ⭐ Personalized for you
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginRight: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
  },
  personalizedBadge: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: '#CBD5E1',
    paddingTop: 12,
  },
  personalizedText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default FlashCardComponent;  
