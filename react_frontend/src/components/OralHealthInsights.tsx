import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FlashCardComponent } from './FlashCardComponent';
import { ORAL_HEALTH_FLASHCARDS, getRandomFlashcards } from '../constants/OralHealthFlashcards';

interface OralHealthInsightsProps {
  autoScroll?: boolean;
  showDots?: boolean;
  personalized?: boolean;
  weakCategories?: string[];
  riskLevel?: string;
}

export const OralHealthInsights: React.FC<OralHealthInsightsProps> = ({
  autoScroll = false,
  showDots = true,
  personalized = false,
  weakCategories = [],
  riskLevel = 'low',
}) => {
  const [cards, setCards] = useState(ORAL_HEALTH_FLASHCARDS.slice(0, 8));
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardWidth = 280;
  const cardMargin = 12;

  useEffect(() => {
    if (personalized) {
      const randomCards = getRandomFlashcards(8);
      setCards(randomCards);
    }
  }, [personalized]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(contentOffsetX / (cardWidth + cardMargin));
    setCurrentIndex(Math.min(nextIndex, cards.length - 1));
  };

  const renderCard = ({ item }: { item: any }) => (
    <FlashCardComponent card={item} width={cardWidth} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Daily Oral Health</Text>
          <Text style={styles.subheading}>Insights & Tips</Text>
        </View>
        {cards.length > 0 && (
          <Text style={styles.counter}>{currentIndex + 1} / {cards.length}</Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        decelerationRate="fast"
        snapToAlignment="start"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {cards.map((card) => (
          <FlashCardComponent key={card.id} card={card} width={cardWidth} />
        ))}
      </ScrollView>

      {showDots && cards.length > 0 && (
        <View style={styles.dotsContainer}>
          {cards.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={index === currentIndex ? styles.activeDot : styles.inactiveDot}
            />
          ))}
        </View>
      )}

      <Text style={styles.footerText}>
        💡 Swipe to explore daily oral health tips and facts
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  headerRow: {
    paddingHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  subheading: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  counter: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  flatListContent: {
    paddingHorizontal: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginHorizontal: 4,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#334155',
    marginHorizontal: 4,
  },
  footerText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 16,
    paddingHorizontal: 24,
  },
});

export default OralHealthInsights;
