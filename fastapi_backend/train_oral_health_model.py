import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import os

def generate_synthetic_data(num_samples=5000):
    np.random.seed(42)
    
    # 1. Generate core features
    brushing_frequency = np.random.choice([0, 1, 2, 3], size=num_samples, p=[0.05, 0.2, 0.6, 0.15]) # times per day
    flossing_frequency = np.random.choice([0, 1, 2, 3, 4, 5, 6, 7], size=num_samples, p=[0.3, 0.2, 0.1, 0.1, 0.05, 0.05, 0.05, 0.15]) # times per week
    sugary_food_frequency = np.random.choice([0, 1, 2, 3, 4, 5], size=num_samples, p=[0.1, 0.3, 0.3, 0.15, 0.1, 0.05]) # times per day
    gum_bleeding = np.random.choice([0, 1], size=num_samples, p=[0.7, 0.3]) # 0: No, 1: Yes
    dental_visits = np.random.choice([0, 1, 2, 3], size=num_samples, p=[0.2, 0.4, 0.35, 0.05]) # times per year
    
    # Assessment metrics
    knowledge_score = np.random.uniform(20, 100, size=num_samples)
    habit_score = np.random.uniform(10, 100, size=num_samples)
    risk_score = np.random.uniform(10, 100, size=num_samples)
    consistency_score = np.random.uniform(0, 100, size=num_samples)
    
    correct_answers = np.random.randint(0, 21, size=num_samples)
    wrong_answers = 20 - correct_answers
    
    duration_seconds = np.random.uniform(30, 300, size=num_samples) # 30s to 5 mins
    
    # Demographics & Lifestyle
    age_group = np.random.choice([1, 2, 3, 4, 5], size=num_samples) # 1: <18, 2: 18-35, 3: 36-50, 4: 51-65, 5: >65
    smoking_status = np.random.choice([0, 1, 2], size=num_samples, p=[0.7, 0.2, 0.1]) # 0: Never, 1: Former, 2: Current
    
    # Calculate target: oral_health_score based on rules (to give model something to learn)
    target_score = (
        (brushing_frequency * 10) +
        (flossing_frequency * 2) +
        (dental_visits * 5) +
        (knowledge_score * 0.1) +
        (habit_score * 0.2) +
        (consistency_score * 0.1) +
        (correct_answers * 1) -
        (sugary_food_frequency * 3) -
        (gum_bleeding * 10) -
        (smoking_status * 8)
    )
    
    # Add noise and clip to 0-100
    noise = np.random.normal(0, 5, size=num_samples)
    target_score = np.clip(target_score + noise, 0, 100)
    
    data = pd.DataFrame({
        'brushing_frequency': brushing_frequency,
        'flossing_frequency': flossing_frequency,
        'sugary_food_frequency': sugary_food_frequency,
        'gum_bleeding': gum_bleeding,
        'dental_visits': dental_visits,
        'knowledge_score': knowledge_score,
        'habit_score': habit_score,
        'risk_score': risk_score,
        'consistency_score': consistency_score,
        'correct_answers': correct_answers,
        'wrong_answers': wrong_answers,
        'duration_seconds': duration_seconds,
        'age_group': age_group,
        'smoking_status': smoking_status,
        'oral_health_score': target_score
    })
    
    return data

def train_model():
    print("Generating synthetic dataset (5000 samples)...")
    df = generate_synthetic_data(5000)
    
    X = df.drop('oral_health_score', axis=1)
    y = df['oral_health_score']
    
    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print("-" * 30)
    print(f"MAE: {mae:.2f}")
    print(f"R² Score: {r2:.4f}")
    print("-" * 30)
    
    save_path = os.path.join(os.path.dirname(__file__), 'oral_health_model.pkl')
    print(f"Saving model to {save_path}...")
    joblib.dump(model, save_path)
    print("Training complete.")

if __name__ == "__main__":
    train_model()
