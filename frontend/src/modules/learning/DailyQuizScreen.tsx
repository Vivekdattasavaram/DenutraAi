import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUIZ_POOL = [
  {
    id: 1,
    question: "Which tooth looks healthy?",
    description: "Select the image that shows a healthy tooth with no signs of decay.",
    options: [
      { id: 'opt1', image: require('../../assets/healthy_tooth.png'), isCorrect: true, explanation: "A healthy tooth has intact white enamel and no dark spots." },
      { id: 'opt2', image: require('../../assets/unhealthy_tooth.png'), isCorrect: false, explanation: "This tooth shows signs of advanced decay." },
      { id: 'opt3', image: require('../../assets/cavity.png'), isCorrect: false, explanation: "This shows a cavity forming in the crown." },
      { id: 'opt4', image: require('../../assets/bleeding_gums.png'), isCorrect: false, explanation: "This image focuses on inflamed gums, not a healthy tooth." }
    ]
  },
  {
    id: 2,
    question: "Healthy Gums Check",
    description: "Which of these images represents healthy gums?",
    options: [
      { id: 'opt1', image: require('../../assets/bleeding_gums.png'), isCorrect: false, explanation: "Bleeding or red gums indicate gingivitis." },
      { id: 'opt2', image: require('../../assets/healthy_gums.png'), isCorrect: true, explanation: "Healthy gums are firm, pale pink, and do not bleed when brushing." },
      { id: 'opt3', image: require('../../assets/unhealthy_tooth.png'), isCorrect: false, explanation: "This indicates severe decay, not healthy gums." },
      { id: 'opt4', image: require('../../assets/cavity.png'), isCorrect: false, explanation: "This indicates a cavity." }
    ]
  },
  {
    id: 3,
    question: "Interdental Cleaning",
    description: "Which technique is specifically used for cleaning between tight teeth?",
    options: [
      { id: 'opt1', image: require('../../assets/healthy_tooth.png'), isCorrect: false, explanation: "This is just a healthy tooth." },
      { id: 'opt2', image: require('../../assets/healthy_gums.png'), isCorrect: false, explanation: "These are healthy gums, but doesn't show the technique." },
      { id: 'opt3', image: require('../../assets/cavity.png'), isCorrect: false, explanation: "This is a cavity." },
      { id: 'opt4', image: require('../../assets/flossing.png'), isCorrect: true, explanation: "Flossing is the recommended technique for removing plaque between teeth." }
    ]
  },
  {
    id: 4,
    question: "Brushing Duration",
    description: "What is the ADA recommended duration for brushing your teeth?",
    options: [
      { id: 'opt1', text: "30 seconds", isCorrect: false, explanation: "30 seconds is not nearly enough time to clean all surfaces." },
      { id: 'opt2', text: "1 minute", isCorrect: false, explanation: "1 minute is better than 30 seconds, but still insufficient." },
      { id: 'opt3', text: "2 minutes", isCorrect: true, explanation: "The ADA recommends brushing for 2 full minutes twice a day." },
      { id: 'opt4', text: "5 minutes", isCorrect: false, explanation: "Brushing for 5 minutes is unnecessary and may cause enamel wear." }
    ]
  },
  {
    id: 5,
    question: "Enamel Erosion",
    description: "Which of the following foods is most likely to cause rapid enamel erosion?",
    options: [
      { id: 'opt1', text: "Carrots", isCorrect: false, explanation: "Carrots stimulate saliva, which is good for teeth." },
      { id: 'opt2', text: "Sour Candies", isCorrect: true, explanation: "Sour candies are extremely acidic and sticky." },
      { id: 'opt3', text: "Cheese", isCorrect: false, explanation: "Cheese helps neutralize mouth acids." },
      { id: 'opt4', text: "Apples", isCorrect: false, explanation: "Apples are high in water and generally safe." }
    ]
  },
  {
    id: 6,
    question: "Toothpaste Truths",
    description: "What is the primary active ingredient in most toothpastes that prevents cavities?",
    options: [
      { id: 'opt1', text: "Baking Soda", isCorrect: false, explanation: "Baking soda helps with stains but isn't the primary cavity fighter." },
      { id: 'opt2', text: "Fluoride", isCorrect: true, explanation: "Fluoride remineralizes enamel and prevents tooth decay." },
      { id: 'opt3', text: "Charcoal", isCorrect: false, explanation: "Charcoal is abrasive and can damage enamel over time." },
      { id: 'opt4', text: "Calcium", isCorrect: false, explanation: "Fluoride is the active ingredient in toothpaste." }
    ]
  },
  {
    id: 7,
    question: "When to Replace Brush",
    description: "How often should you replace your toothbrush?",
    options: [
      { id: 'opt1', text: "Every month", isCorrect: false, explanation: "That's a bit too frequent unless you've been sick." },
      { id: 'opt2', text: "Every 3-4 months", isCorrect: true, explanation: "Bristles become frayed and less effective after 3-4 months." },
      { id: 'opt3', text: "Every 6 months", isCorrect: false, explanation: "Waiting 6 months means you're using a highly ineffective brush." },
      { id: 'opt4', text: "Once a year", isCorrect: false, explanation: "That's definitely too long." }
    ]
  },
  {
    id: 8,
    question: "Bleeding Gums",
    description: "If your gums bleed when you floss, what should you do?",
    options: [
      { id: 'opt1', text: "Stop flossing immediately", isCorrect: false, explanation: "Stopping will only make the underlying inflammation worse." },
      { id: 'opt2', text: "Brush harder", isCorrect: false, explanation: "Brushing harder can damage already inflamed gums." },
      { id: 'opt3', text: "Continue flossing gently", isCorrect: true, explanation: "Bleeding is a sign of inflammation (gingivitis) which flossing helps clear up." },
      { id: 'opt4', text: "Use mouthwash only", isCorrect: false, explanation: "Mouthwash cannot remove physical plaque between teeth." }
    ]
  },
  {
    id: 9,
    question: "Sugar and Cavities",
    description: "How does sugar lead to cavities?",
    options: [
      { id: 'opt1', text: "Sugar is acidic and burns enamel directly", isCorrect: false, explanation: "Sugar itself isn't acidic enough to burn enamel directly." },
      { id: 'opt2', text: "Bacteria eat sugar and produce acid", isCorrect: true, explanation: "Plaque bacteria feed on sugar and release acids that dissolve enamel." },
      { id: 'opt3', text: "Sugar physically scrapes the tooth", isCorrect: false, explanation: "Sugar crystals dissolve quickly and don't scrape enamel." },
      { id: 'opt4', text: "Sugar causes gums to recede", isCorrect: false, explanation: "Gum recession is typically caused by gum disease or hard brushing." }
    ]
  },
  {
    id: 10,
    question: "Mouthwash Timing",
    description: "When is the best time to use a fluoride mouthwash?",
    options: [
      { id: 'opt1', text: "Right after brushing", isCorrect: false, explanation: "Using it immediately after brushing washes away the concentrated fluoride from toothpaste." },
      { id: 'opt2', text: "Before brushing", isCorrect: false, explanation: "It's less effective if the plaque hasn't been physically removed yet." },
      { id: 'opt3', text: "At a different time than brushing", isCorrect: true, explanation: "Using it at a different time (e.g., after lunch) gives your teeth an extra fluoride boost." },
      { id: 'opt4', text: "Only when you have bad breath", isCorrect: false, explanation: "Fluoride mouthwash is for cavity prevention, not just breath." }
    ]
  },
  {
    id: 11,
    question: "Saliva's Role",
    description: "What is a primary function of saliva in oral health?",
    options: [
      { id: 'opt1', text: "It causes plaque buildup", isCorrect: false, explanation: "Saliva actually helps wash away plaque." },
      { id: 'opt2', text: "It neutralizes acids", isCorrect: true, explanation: "Saliva washes away food particles and neutralizes acids produced by bacteria." },
      { id: 'opt3', text: "It stains teeth", isCorrect: false, explanation: "Saliva doesn't stain teeth." },
      { id: 'opt4', text: "It erodes enamel", isCorrect: false, explanation: "Acids erode enamel, saliva protects it." }
    ]
  },
  {
    id: 12,
    question: "Hard vs Soft Bristles",
    description: "What type of toothbrush bristles do most dentists recommend?",
    options: [
      { id: 'opt1', text: "Hard bristles", isCorrect: false, explanation: "Hard bristles can damage gums and enamel." },
      { id: 'opt2', text: "Medium bristles", isCorrect: false, explanation: "Medium bristles are still too abrasive for many people." },
      { id: 'opt3', text: "Soft bristles", isCorrect: true, explanation: "Soft bristles effectively remove plaque without damaging gums or enamel." },
      { id: 'opt4', text: "Rubber bristles", isCorrect: false, explanation: "Soft nylon bristles are the standard recommendation." }
    ]
  },
  {
    id: 13,
    question: "Tooth Decay Signs",
    description: "Which is often the FIRST sign of tooth decay?",
    options: [
      { id: 'opt1', text: "Severe toothache", isCorrect: false, explanation: "A toothache usually indicates advanced decay." },
      { id: 'opt2', text: "White spots on enamel", isCorrect: true, explanation: "Chalky white spots indicate early demineralization of the enamel." },
      { id: 'opt3', text: "A visible hole", isCorrect: false, explanation: "A hole (cavity) happens after the enamel breaks down." },
      { id: 'opt4', text: "Bleeding gums", isCorrect: false, explanation: "This is a sign of gum disease, not necessarily tooth decay." }
    ]
  },
  {
    id: 14,
    question: "Diet and Teeth",
    description: "Which beverage is most harmful to tooth enamel?",
    options: [
      { id: 'opt1', text: "Milk", isCorrect: false, explanation: "Milk provides calcium and is good for teeth." },
      { id: 'opt2', text: "Tap water", isCorrect: false, explanation: "Tap water often contains fluoride and helps wash away food." },
      { id: 'opt3', text: "Soda (Regular or Diet)", isCorrect: true, explanation: "Both contain acids (like phosphoric acid) that erode enamel, even diet soda." },
      { id: 'opt4', text: "Unsweetened tea", isCorrect: false, explanation: "Unsweetened tea is generally safe and contains some fluoride." }
    ]
  },
  {
    id: 15,
    question: "Flossing Frequency",
    description: "What is the minimum recommended frequency for flossing?",
    options: [
      { id: 'opt1', text: "Twice a week", isCorrect: false, explanation: "Plaque turns to tartar in 24-48 hours, so this is too infrequent." },
      { id: 'opt2', text: "Once a day", isCorrect: true, explanation: "Flossing at least once a day is needed to disrupt plaque formation between teeth." },
      { id: 'opt3', text: "After every meal", isCorrect: false, explanation: "While helpful, once a day is the minimum standard." },
      { id: 'opt4', text: "Only when food is stuck", isCorrect: false, explanation: "Plaque builds up even if you don't feel food stuck." }
    ]
  },
  {
    id: 16,
    question: "Children's Teeth",
    description: "When should a child have their first dental visit?",
    options: [
      { id: 'opt1', text: "When they start school", isCorrect: false, explanation: "This is far too late to establish preventative care." },
      { id: 'opt2', text: "When all baby teeth are in", isCorrect: false, explanation: "Waiting until age 2-3 misses early intervention opportunities." },
      { id: 'opt3', text: "By age 1 or within 6 months of first tooth", isCorrect: true, explanation: "Early visits help establish a dental home and prevent early childhood caries." },
      { id: 'opt4', text: "When they get their first permanent tooth", isCorrect: false, explanation: "Baby teeth need care too." }
    ]
  },
  {
    id: 17,
    question: "Plaque vs Tartar",
    description: "What is the main difference between plaque and tartar (calculus)?",
    options: [
      { id: 'opt1', text: "They are the same thing", isCorrect: false, explanation: "They are different stages of bacterial buildup." },
      { id: 'opt2', text: "Plaque is hard, tartar is soft", isCorrect: false, explanation: "It's the other way around." },
      { id: 'opt3', text: "Plaque can be brushed away, tartar requires a dentist", isCorrect: true, explanation: "Tartar is calcified plaque that bonds to the tooth and requires professional scaling." },
      { id: 'opt4', text: "Tartar only forms on fillings", isCorrect: false, explanation: "Tartar can form on natural teeth." }
    ]
  },
  {
    id: 18,
    question: "Brushing Pressure",
    description: "What is a negative consequence of brushing too hard?",
    options: [
      { id: 'opt1', text: "Cleaner teeth", isCorrect: false, explanation: "Hard brushing doesn't necessarily clean better." },
      { id: 'opt2', text: "Gum recession and enamel wear", isCorrect: true, explanation: "Aggressive brushing wears away the protective enamel and causes gums to pull back." },
      { id: 'opt3', text: "Stronger gums", isCorrect: false, explanation: "Gums get traumatized, not stronger." },
      { id: 'opt4', text: "Whiter teeth", isCorrect: false, explanation: "It can actually make teeth look yellower by exposing the dentin underneath." }
    ]
  },
  {
    id: 19,
    question: "Oral Cancer Screening",
    description: "Who typically performs an oral cancer screening?",
    options: [
      { id: 'opt1', text: "Only an oncologist", isCorrect: false, explanation: "Oncologists treat cancer, but dentists screen for it." },
      { id: 'opt2', text: "Your dentist during a routine checkup", isCorrect: true, explanation: "Dentists look for abnormalities in the mouth, tongue, and throat during standard exams." },
      { id: 'opt3', text: "Your primary care doctor only", isCorrect: false, explanation: "Dentists are highly trained to spot oral lesions." },
      { id: 'opt4', text: "It requires a special separate appointment", isCorrect: false, explanation: "It is usually part of a standard checkup." }
    ]
  },
  {
    id: 20,
    question: "Tooth Sensitivity",
    description: "What commonly causes a sharp, temporary pain when drinking cold water?",
    options: [
      { id: 'opt1', text: "Exposed dentin due to enamel wear or gum recession", isCorrect: true, explanation: "When the protective enamel or gums wear away, the sensitive dentin layer is exposed." },
      { id: 'opt2', text: "Using a soft-bristled brush", isCorrect: false, explanation: "Soft bristles prevent sensitivity." },
      { id: 'opt3', text: "Eating too much cheese", isCorrect: false, explanation: "Cheese does not cause sensitivity." },
      { id: 'opt4', text: "Using fluoride toothpaste", isCorrect: false, explanation: "Fluoride actually helps reduce sensitivity." }
    ]
  }
];

export default function DailyQuizScreen({ navigation }: any) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    // Select exactly 5 random questions
    const shuffled = [...QUIZ_POOL].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 5).map(q => {
      // Shuffle options for each question
      return { ...q, options: [...q.options].sort(() => Math.random() - 0.5) };
    });
    setQuestions(selectedQuestions);
  }, []);

  const handleSubmit = () => {
    if (selected === null) return;
    
    const isCorrect = questions[currentIndex].options[selected].isCorrect;
    if (isCorrect) {
      setScore(score + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = async () => {
    if (currentIndex < 4) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setIsSubmitted(false);
    } else {
      // Finish quiz
      setQuizFinished(true);
      try {
        const currentStats = await AsyncStorage.getItem('user_engagement_stats');
        const stats = currentStats ? JSON.parse(currentStats) : { quizzes: 0, facts: 0, videos: 0 };
        stats.quizzes = (stats.quizzes || 0) + 1;
        await AsyncStorage.setItem('user_engagement_stats', JSON.stringify(stats));
      } catch (e) {
        console.log('Error saving quiz progress', e);
      }
    }
  };

  if (questions.length === 0) return null;

  if (quizFinished) {
    return (
      <ScreenWrapper useSafeArea className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center px-6">
          <View className="w-32 h-32 rounded-full bg-primary/20 items-center justify-center mb-6 border-4 border-primary/30">
            <Text className="text-5xl font-black text-white">{score}/5</Text>
          </View>
          <Text className="text-3xl font-black text-white mb-2">Quiz Complete!</Text>
          <Text className="text-textMuted text-lg text-center mb-10">
            {score === 5 ? "Perfect score! Your oral health literacy is outstanding." : 
             score >= 3 ? "Great job! You're building solid oral health knowledge." : 
             "Good effort! Keep learning to improve your oral health habits."}
          </Text>
          <Button 
            title="Return to Dashboard" 
            onPress={() => navigation.goBack()} 
            size="lg"
            className="w-full"
          />
        </View>
      </ScreenWrapper>
    );
  }

  const currentQ = questions[currentIndex];
  const isCorrect = isSubmitted && selected !== null && currentQ.options[selected].isCorrect;

  return (
    <ScreenWrapper useSafeArea className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg">Question {currentIndex + 1} of 5</Text>
        <Text className="text-primary font-bold text-lg w-10 text-right">{score} XP</Text>
      </View>

      {/* Progress Bar */}
      <View className="px-6 mb-4">
        <View className="h-2 bg-surfaceAlt rounded-full overflow-hidden">
          <View 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${((currentIndex) / 5) * 100}%` }} 
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-2 pb-10" showsVerticalScrollIndicator={false}>
        {!isSubmitted ? (
          <>
            <View className="mb-8">
              <Text className="text-3xl font-black text-white mb-2 leading-tight">{currentQ.question}</Text>
              <Text className="text-textMuted text-base">{currentQ.description}</Text>
            </View>

            <View className="flex-row flex-wrap justify-between">
              {currentQ.options.map((opt: any, i: number) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelected(i)}
                  className={`w-[48%] bg-surface rounded-3xl p-4 items-center justify-center mb-4 border shadow-soft min-h-[160px] relative ${
                    selected === i ? 'border-primary bg-primary/10' : 'border-white/5'
                  }`}
                >
                  {opt.image ? (
                    <Image source={opt.image} className="w-20 h-20 opacity-90" resizeMode="contain" />
                  ) : (
                    <Text className={`text-center font-bold px-2 ${selected === i ? 'text-primary' : 'text-white'}`}>{opt.text}</Text>
                  )}
                  
                  {selected === i && (
                    <View className="absolute top-3 right-3 bg-background rounded-full">
                      <CheckCircle2 size={24} color="#3B82F6" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center mt-6">
            <View className="items-center mb-8">
              <View className={`w-24 h-24 rounded-full items-center justify-center mb-6 border-4 ${isCorrect ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                <Text className="text-5xl">{isCorrect ? '✅' : '❌'}</Text>
              </View>
              <Text className="text-3xl font-black text-white text-center">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </Text>
            </View>

            <View className="bg-surface p-6 rounded-3xl border border-white/5 shadow-soft">
              <Text className="text-white/60 font-medium uppercase tracking-widest text-xs mb-4">Explanation</Text>
              <Text className="text-lg text-white leading-relaxed">
                {currentQ.options[selected!].explanation}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="px-6 py-4 bg-background border-t border-border/50">
        {!isSubmitted ? (
          <Button 
            title="Submit Answer" 
            onPress={handleSubmit} 
            size="lg"
            disabled={selected === null}
          />
        ) : (
          <Button 
            title={currentIndex < 4 ? "Next Question" : "Finish Quiz"} 
            onPress={handleNext} 
            size="lg"
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
