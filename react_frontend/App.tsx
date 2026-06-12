import "./global.css";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/hooks/useAuth";
import { navigationRef } from "./src/navigation/NavigationService";

import { View, Platform } from "react-native";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <View style={{ flex: 1, backgroundColor: Platform.OS === 'web' ? '#020617' : 'transparent', alignItems: 'center' }}>
          <View style={{ flex: 1, width: '100%', backgroundColor: '#07101F', overflow: 'hidden' }}>
            <NavigationContainer ref={navigationRef}>
              <StatusBar style="light" />
              <RootNavigator />
            </NavigationContainer>
          </View>
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}