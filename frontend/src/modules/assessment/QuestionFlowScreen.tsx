import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, Clock } from 'lucide-react-native';
import { apiClient } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function QuestionFlowScreen({ navigation, route }: any) {
  const literacyLevel = route.params?.literacyLevel || 'Medium';
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [shuffledOptions, setShuffledOptions] = useState<{ text: string, originalIndex: number }[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [nextQuestionData, setNextQuestionData] = useState<any>(null);
  const [categoryStats, setCategoryStats] = useState<Record<string, { correct: number, total: number }>>({});
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Timer State
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startAssessment();
    return () => stopTimer();
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeTakenSeconds(prev => prev + 1);
      setTotalDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startAssessment = async () => {
    try {
      const res = await apiClient.post('/api/assessment/start', { literacy_level: literacyLevel });
      setAssessmentId(res.data.assessment_id);
      handleSetQuestion(res.data.first_question);
      setTotalQuestions(res.data.total_questions || 20);
      setQuestionNumber(1);
      startTimer();
    } catch (error) {
      Alert.alert('Error', 'Failed to start assessment.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSetQuestion = (question: any) => {
    setCurrentQuestion(question);
    if (question && question.options) {
      const optionsWithIndex = question.options.map((text: string, i: number) => ({ text, originalIndex: i }));
      for (let i = optionsWithIndex.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
      }
      setShuffledOptions(optionsWithIndex);
    }
  };

  const handleNext = async () => {
    if (selectedOptionIndex === null || !assessmentId || !currentQuestion) return;
    
    stopTimer();
    setSubmitting(true);
    
    try {
      // 1. Submit Answer
      const answerRes = await apiClient.post('/api/assessment/answer', {
        assessment_id: assessmentId,
        question_id: currentQuestion.id,
        selected_option_index: shuffledOptions[selectedOptionIndex].originalIndex,
        time_taken_seconds: timeTakenSeconds
      });
      
      const { educational_tip, is_correct, correct_answer_text, explanation, next_question, answered_count } = answerRes.data;
      
      // Record category stats
      setCategoryStats(prev => {
        const cat = currentQuestion.category;
        const currentCat = prev[cat] || { correct: 0, total: 0 };
        return {
          ...prev,
          [cat]: {
            correct: currentCat.correct + (is_correct ? 1 : 0),
            total: currentCat.total + 1
          }
        };
      });

      // Save next question data for the "Continue" action
      setNextQuestionData({
        next_question,
        answered_count
      });

      // Show inline feedback instead of Alert
      setFeedbackData({
        is_correct,
        educational_tip,
        correct_answer_text,
        explanation
      });
      
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = async () => {
    setFeedbackData(null);
    setTimeTakenSeconds(0);
    setSelectedOptionIndex(null);

    const finishAssessment = async () => {
      setSubmitting(true);
      try {
        const scores: Record<string, number> = {};
        Object.keys(categoryStats).forEach(cat => {
          scores[cat] = Math.round((categoryStats[cat].correct / categoryStats[cat].total) * 100);
        });
        await AsyncStorage.setItem('category_scores', JSON.stringify(scores));
        
        const submitRes = await apiClient.post(`/api/assessment/submit/${assessmentId}`, {
          category_scores: scores
        });
        navigation.replace('AssessmentResult', { result: submitRes.data });
      } catch (e) {
        Alert.alert('Error', 'Failed to complete assessment.');
      } finally {
        setSubmitting(false);
      }
    };

    if (questionNumber >= totalQuestions && !nextQuestionData?.next_question) {
      // Finish Assessment
      await finishAssessment();
    } else if (nextQuestionData?.next_question) {
      handleSetQuestion(nextQuestionData.next_question);
      setQuestionNumber(nextQuestionData.answered_count + 1);
      setNextQuestionData(null);
      startTimer();
    } else {
      // Fallback
      await finishAssessment();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = (questionNumber / totalQuestions) * 100;

  if (loading) {
    return (
      <ScreenWrapper className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        
        <View className="flex-1 items-center">
            <Text className="text-white/60 font-bold text-lg tracking-widest">Question {questionNumber} / {totalQuestions}</Text>
        </View>

        <View className="flex-row items-center bg-white/10 rounded-full px-3 py-1.5 border border-white/5">
          <Clock size={16} color="#3B82F6" />
          <Text className="text-primary font-bold ml-2 font-mono">{formatTime(totalDuration)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="px-6 mb-8 mt-2">
        <View className="h-2 bg-surface rounded-full overflow-hidden">
          <View 
            className="h-full bg-primary" 
            style={{ width: `${progress}%` }} 
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        {feedbackData ? (
          <View className="flex-1 justify-center mt-10">
            <View className="items-center mb-8">
              <View className={`w-24 h-24 rounded-full items-center justify-center mb-6 border-4 ${feedbackData.is_correct ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                <Text className="text-5xl">{feedbackData.is_correct ? '✅' : '❌'}</Text>
              </View>
              <Text className="text-3xl font-black text-white text-center">
                {feedbackData.is_correct ? 'Correct!' : 'Incorrect'}
              </Text>
            </View>

            <View className="bg-surface p-6 rounded-3xl border border-white/5 shadow-soft space-y-4">
              <Text className="text-white/60 font-medium uppercase tracking-widest text-xs">Correct Answer</Text>
              <Text className="text-lg font-bold text-white leading-tight">
                {feedbackData.correct_answer_text}
              </Text>
              
              {feedbackData.educational_tip && (
                <View className="mt-4 pt-4 border-t border-white/10">
                  <Text className="text-primary font-medium uppercase tracking-widest text-xs mb-2">Did you know?</Text>
                  <Text className="text-textMuted text-base leading-relaxed">
                    {feedbackData.educational_tip || feedbackData.explanation}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          currentQuestion && (
            <>
              <View className="flex-row items-center mb-4">
                <View className="bg-primary/20 px-3 py-1 rounded-full">
                  <Text className="text-primary text-xs font-bold uppercase tracking-wider">{currentQuestion.category}</Text>
                </View>
                <View className="bg-surface px-3 py-1 rounded-full ml-2">
                  <Text className="text-textMuted text-xs font-bold uppercase tracking-wider">{currentQuestion.difficulty}</Text>
                </View>
              </View>

              <Text className="text-3xl font-black text-white mb-10 leading-tight">
                {currentQuestion.question_text}
              </Text>

              <View className="space-y-4">
                {shuffledOptions.map((option, index: number) => {
                  const isSelected = selectedOptionIndex === index;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedOptionIndex(index)}
                      className={`w-full p-5 rounded-3xl border border-white/5 flex-row items-center shadow-soft ${
                        isSelected ? 'bg-primary/20 border-primary/40' : 'bg-surface'
                      }`}
                    >
                      <View className={`w-7 h-7 rounded-full border-2 mr-4 items-center justify-center ${
                        isSelected ? 'border-primary' : 'border-white/20'
                      }`}>
                        {isSelected && <View className="w-3.5 h-3.5 rounded-full bg-primary" />}
                      </View>
                      <Text className={`text-lg font-semibold flex-1 ${
                        isSelected ? 'text-white' : 'text-textMuted'
                      }`}>
                        {option.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )
        )}
      </ScrollView>

      {/* Footer */}
      <View className="p-6">
        {feedbackData ? (
          <Button 
            title={questionNumber >= totalQuestions ? "Finish Assessment" : "Continue"}
            onPress={handleContinue}
            size="lg"
            loading={submitting}
          />
        ) : (
          <Button 
            title="Check Answer"
            onPress={handleNext}
            disabled={selectedOptionIndex === null || submitting}
            size="lg"
            loading={submitting}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
