import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { ChevronLeft, Check, X, RotateCcw } from 'lucide-react-native';
import Swiper from 'react-native-deck-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../../components/ui/Button';

const MOCK_CARDS = [
  { 
    statement: "Brushing harder cleans teeth better.", 
    is_fact: false, 
    category: "Habit",
    explanation: "Brushing aggressively can wear down enamel and damage gums.",
    why_it_matters: "Proper brushing technique protects teeth while effectively removing plaque without causing recession."
  },
  { 
    statement: "Flossing is just as important as brushing.", 
    is_fact: true, 
    category: "Knowledge",
    explanation: "A toothbrush cannot reach the tight spaces between teeth where plaque thrives.",
    why_it_matters: "Flossing prevents interdental cavities and gum disease which brushing alone cannot stop."
  },
  { 
    statement: "Sugar directly causes cavities.", 
    is_fact: false, 
    category: "Diet",
    explanation: "Sugar feeds the bacteria in your mouth, which then produce acids that dissolve tooth enamel.",
    why_it_matters: "Understanding that acid is the real culprit helps emphasize the importance of neutralizing mouth pH."
  },
  { 
    statement: "You should brush your teeth immediately after eating acidic foods.", 
    is_fact: false, 
    category: "Habit",
    explanation: "Acid weakens enamel, making it temporarily soft. Brushing immediately can scrub away this weakened enamel.",
    why_it_matters: "Waiting 30 minutes allows your saliva to neutralize the acid and harden the enamel again."
  },
  { 
    statement: "Fluoride helps remineralize tooth enamel.", 
    is_fact: true, 
    category: "Knowledge",
    explanation: "Fluoride ions integrate into the tooth enamel structure, making it more resistant to acid attacks.",
    why_it_matters: "Daily fluoride use is the most effective way to prevent and reverse early stages of tooth decay."
  }
];

export default function FactOrMythScreen({ navigation }: any) {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipedAll, setSwipedAll] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastSwipedCard, setLastSwipedCard] = useState<any>(null);
  const [wasCorrect, setWasCorrect] = useState(false);
  const swiperRef = useRef<Swiper<any>>(null);
  
  useEffect(() => {
    fetchFacts();
  }, []);

  const fetchFacts = async () => {
    setLoading(true);
    setCards([...MOCK_CARDS].sort(() => Math.random() - 0.5));
    setSwipedAll(false);
    setLoading(false);
  };

  const handleSwipe = async (index: number, isFactSwiped: boolean) => {
    const card = cards[index];
    const isCorrect = (isFactSwiped && card.is_fact) || (!isFactSwiped && !card.is_fact);
    
    setLastSwipedCard(card);
    setWasCorrect(isCorrect);
    setModalVisible(true);

    try {
      const currentStats = await AsyncStorage.getItem('user_engagement_stats');
      const stats = currentStats ? JSON.parse(currentStats) : { quizzes: 0, facts: 0, videos: 0 };
      stats.facts = (stats.facts || 0) + 1;
      await AsyncStorage.setItem('user_engagement_stats', JSON.stringify(stats));
    } catch (e) {
      console.log('Error saving fact progress', e);
    }
  };

  const onSwipedAll = () => {
    setSwipedAll(true);
  };

  const renderCard = (card: any, index: number) => {
    if (!card) return null;
    return (
      <View className="bg-surface p-8 rounded-[40px] border border-white/5 items-center justify-center shadow-soft h-[400px]">
        <View className="bg-primary/20 px-3 py-1 rounded-full mb-6">
            <Text className="text-primary font-bold text-xs uppercase tracking-wider">{card.category}</Text>
        </View>
        <Text className="text-white font-bold text-3xl text-center leading-tight mb-8">
          "{card.statement}"
        </Text>
        <Text className="text-white/40 text-center text-sm absolute bottom-8">
            Swipe Right for FACT, Left for MYTH
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <ScreenWrapper className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper useSafeArea className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white/60 font-bold text-lg tracking-widest">Fact or Myth</Text>
        <View className="w-8" />
      </View>

      <View className="flex-1 px-4">
          {!swipedAll ? (
            <Swiper
                ref={swiperRef}
                cards={cards}
                renderCard={renderCard}
                onSwipedLeft={(idx) => handleSwipe(idx, false)} // Myth
                onSwipedRight={(idx) => handleSwipe(idx, true)} // Fact
                onSwipedAll={onSwipedAll}
                cardIndex={0}
                backgroundColor="transparent"
                stackSize={3}
                animateOverlayLabelsOpacity
                animateCardOpacity
                swipeBackCard
                overlayLabels={{
                    left: {
                        title: 'MYTH',
                        style: {
                            label: {
                                backgroundColor: '#EF4444',
                                color: '#FFF',
                                fontSize: 32,
                                fontWeight: 'bold',
                                borderRadius: 16,
                                padding: 12,
                                overflow: 'hidden'
                            },
                            wrapper: {
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                marginTop: 30,
                                marginLeft: -30
                            }
                        }
                    },
                    right: {
                        title: 'FACT',
                        style: {
                            label: {
                                backgroundColor: '#10B981',
                                color: '#FFF',
                                fontSize: 32,
                                fontWeight: 'bold',
                                borderRadius: 16,
                                padding: 12,
                                overflow: 'hidden'
                            },
                            wrapper: {
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                marginTop: 30,
                                marginLeft: 30
                            }
                        }
                    }
                }}
            />
          ) : (
            <View className="flex-1 items-center justify-center p-6">
                <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-6 border-2 border-primary/50">
                    <Check size={40} color="#3B82F6" />
                </View>
                <Text className="text-3xl font-bold text-white text-center mb-2">Great Job!</Text>
                <Text className="text-textMuted text-center text-lg mb-8">You've completed all the facts and myths for now.</Text>
                
                <TouchableOpacity 
                    className="flex-row items-center bg-surface py-3 px-6 rounded-full border border-white/10"
                    onPress={fetchFacts}
                >
                    <RotateCcw size={20} color="#F8FAFC" />
                    <Text className="text-white font-bold text-base ml-2">Play Again</Text>
                </TouchableOpacity>
            </View>
          )}
      </View>

      {/* Educational Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-background/80">
          <View className="bg-surface rounded-t-[40px] p-8 border-t border-white/10">
            {lastSwipedCard && (
              <>
                <View className="flex-row items-center justify-between mb-6">
                  <View className={`px-4 py-2 rounded-full ${lastSwipedCard.is_fact ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <Text className={`font-black text-xl tracking-widest ${lastSwipedCard.is_fact ? 'text-green-400' : 'text-red-400'}`}>
                      {lastSwipedCard.is_fact ? 'IT IS A FACT' : 'IT IS A MYTH'}
                    </Text>
                  </View>
                  {wasCorrect ? (
                    <Text className="text-white font-bold text-lg">✅ You got it!</Text>
                  ) : (
                    <Text className="text-white font-bold text-lg">❌ Not quite</Text>
                  )}
                </View>
                
                <Text className="text-white/60 font-medium uppercase tracking-widest text-xs mb-2">Explanation</Text>
                <Text className="text-white text-lg mb-6 leading-relaxed">
                  {lastSwipedCard.explanation}
                </Text>

                <Text className="text-white/60 font-medium uppercase tracking-widest text-xs mb-2">Why It Matters</Text>
                <Text className="text-white text-lg mb-8 leading-relaxed">
                  {lastSwipedCard.why_it_matters}
                </Text>

                <Button 
                  title="Next Card" 
                  onPress={() => setModalVisible(false)} 
                  size="lg"
                  className="w-full"
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
