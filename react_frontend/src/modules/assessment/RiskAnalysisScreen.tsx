import React from 'react';
import { View, Text, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import { PieChart } from 'react-native-gifted-charts';

export default function RiskAnalysisScreen({ navigation, route }: any) {
  const result = route?.params?.result;
  const assessment = result?.assessment || {};
  const score = assessment.oral_health_score ?? 68;
  const confidence = assessment.ml_confidence ?? 0.78;
  const risk_level = assessment.risk_level ?? 'Moderate Risk';

  const getRiskColor = (risk: string) => {
    if (risk === "Low Risk" || risk === "Healthy") return "#10B981"; // green
    if (risk === "Moderate Risk") return "#F59E0B"; // yellow
    return "#EF4444"; // red
  };
  
  const riskColor = getRiskColor(risk_level);

  return (
    <ScreenWrapper useSafeArea className="flex-1 bg-background">
      <View className="flex-row items-center px-6 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">Risk Analysis</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        <Text className="text-textMuted mb-6 text-base">Detailed breakdown of your oral health factors</Text>

        <View className="bg-surface rounded-3xl p-6 mb-6 border border-white/5 shadow-soft items-center">
          <Text className="text-white/80 font-semibold text-lg mb-6">Overall Risk Level</Text>
          
          <View className="relative justify-center items-center h-40 w-40 mb-6">
            <PieChart
              donut
              radius={80}
              innerRadius={65}
              data={[
                { value: score, color: riskColor },
                { value: 100 - score, color: '#1A2A45' }
              ]}
              centerLabelComponent={() => (
                <View className="items-center justify-center">
                  <Text className="text-2xl font-black text-text text-center leading-tight" style={{ color: riskColor }}>
                    {risk_level.replace(' ', '\n')}
                  </Text>
                </View>
              )}
            />
          </View>

          <View className="w-full bg-background rounded-2xl p-4 border border-white/5 flex-row items-center justify-between">
            <View>
              <Text className="text-text font-semibold">AI Confidence</Text>
              <Text className="text-textMuted text-xs mt-1">Model certainty</Text>
            </View>
            <View className="items-end">
              <Text className="text-accent font-bold text-lg">{Math.round(confidence * 100)}%</Text>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-text font-bold text-xl mb-4">Risk Factors</Text>
          
          <RiskFactorRow title="Gum Health" risk="High" icon={<AlertCircle color="#EF4444" size={20} />} color="#EF4444" />
          <RiskFactorRow title="Cavity Risk" risk="Moderate" icon={<Info color="#F59E0B" size={20} />} color="#F59E0B" />
          <RiskFactorRow title="Brushing Routine" risk="Good" icon={<CheckCircle color="#10B981" size={20} />} color="#10B981" />
          <RiskFactorRow title="Dietary Sugar" risk="High" icon={<AlertCircle color="#EF4444" size={20} />} color="#EF4444" />
        </View>

      </ScrollView>

      <View className="px-6 py-4 bg-background border-t border-border/50">
        <Button title="View Your Path" onPress={() => navigation.navigate('HomeTab')} size="lg" />
      </View>
    </ScreenWrapper>
  );
}

function RiskFactorRow({ title, risk, icon, color }: any) {
  return (
    <View className="flex-row items-center justify-between bg-surface p-4 rounded-2xl mb-3 border border-white/5">
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-background items-center justify-center mr-3">
          {icon}
        </View>
        <Text className="text-text font-semibold">{title}</Text>
      </View>
      <Text className="font-bold" style={{ color }}>{risk}</Text>
    </View>
  );
}
