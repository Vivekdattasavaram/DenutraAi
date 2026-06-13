import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const ageOptions = ['Under 18', '18-25', '26-40', '40+'];
const goalOptions = ['Improve oral health', 'Prevent cavities', 'Build healthier habits', 'Track my progress'];

export default function OnboardingScreen({ navigation, route }: any) {
  const { token, user } = route.params || {};
  const { login } = useAuth();
  const [name, setName] = useState(user?.full_name || '');
  const [ageGroup, setAgeGroup] = useState('');
  const [goal, setGoal] = useState('');

  const canContinue = name.trim().length > 0 && ageGroup !== '' && goal !== '';

  return (
    <ScreenWrapper className="flex-1 bg-background" useSafeArea>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 40 }}>
        <View className="mb-10">
          <Text className="text-3xl font-bold text-text mb-4">Let's setup your profile</Text>
          <Text className="text-textMuted text-base">
            We need a few details to personalize your experience.
          </Text>
        </View>

        <View className="space-y-6 flex-1">
          <View className="bg-surface p-5 rounded-2xl border border-border">
            <Text className="text-text font-medium mb-3">Your Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
              className="bg-background border border-border rounded-2xl px-4 py-3 text-text"
            />
          </View>

          <View className="bg-surface p-5 rounded-2xl border border-border">
            <Text className="text-text font-medium mb-3">Age Group</Text>
            <View className="flex-row flex-wrap justify-between">
              {ageOptions.map((option) => {
                const active = ageGroup === option;
                return (
                  <TouchableOpacity
                    key={option}
                    className={`w-1/2 rounded-2xl border px-4 py-3 mb-3 ${active ? 'bg-primary border-primary' : 'bg-background border-border'}`}
                    onPress={() => setAgeGroup(option)}
                  >
                    <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-text'}`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="bg-surface p-5 rounded-2xl border border-border">
            <Text className="text-text font-medium mb-3">Primary Goal</Text>
            <View className="space-y-3">
              {goalOptions.map((option) => {
                const active = goal === option;
                return (
                  <TouchableOpacity
                    key={option}
                    className={`rounded-2xl border px-4 py-3 ${active ? 'bg-primary border-primary' : 'bg-background border-border'}`}
                    onPress={() => setGoal(option)}
                  >
                    <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-text'}`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View className="mt-8">
          <Text className="text-textMuted text-sm mb-4">
            {canContinue
              ? `Awesome, ${name}! You are set to continue with ${ageGroup} and goal: ${goal}.`
              : 'Choose your profile details to continue.'}
          </Text>
          <Button
            title="Complete Setup"
            onPress={async () => {
              if (!canContinue) return;
              if (token) {
                await login(token, user);
              } else {
                navigation.replace('Login');
              }
            }}
            size="lg"
            disabled={!canContinue}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
