import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

def generate_synthetic_data(num_samples=2000):
    np.random.seed(42)
    
    # Generate features
    brushing_frequency = np.random.randint(0, 4, num_samples) # 0 to 3 times
    flossing_frequency = np.random.randint(0, 8, num_samples) # 0 to 7 times a week
    sugary_food_intake = np.random.randint(0, 5, num_samples) # 0 to 4 level (low to high)
    smoking = np.random.randint(0, 2, num_samples) # 0 or 1
    alcohol_consumption = np.random.randint(0, 4, num_samples) # 0 to 3 level
    gum_bleeding = np.random.randint(0, 2, num_samples) # 0 or 1
    bad_breath = np.random.randint(0, 2, num_samples) # 0 or 1
    dental_visits = np.random.randint(0, 3, num_samples) # visits per year
    water_intake = np.random.randint(1, 10, num_samples) # glasses per day
    mouth_ulcers = np.random.randint(0, 2, num_samples) # 0 or 1
    age = np.random.randint(10, 80, num_samples)
    knowledge_score = np.random.uniform(0, 100, num_samples)
    habit_score = np.random.uniform(0, 100, num_samples)
    consistency_score = np.random.uniform(0, 100, num_samples)
    
    # Calculate a realistic target score based on weights
    # Base score
    base = 50.0
    
    # Positive impacts
    base += brushing_frequency * 8
    base += flossing_frequency * 2
    base += dental_visits * 5
    base += (knowledge_score * 0.1)
    base += (habit_score * 0.15)
    base += (consistency_score * 0.05)
    
    # Negative impacts
    base -= sugary_food_intake * 3
    base -= smoking * 15
    base -= alcohol_consumption * 2
    base -= gum_bleeding * 10
    base -= bad_breath * 5
    base -= mouth_ulcers * 3
    base -= (age * 0.1) # Slight natural degradation
    
    # Add some noise
    base += np.random.normal(0, 3, num_samples)
    
    # Clip between 0 and 100
    oral_health_score = np.clip(base, 0, 100)
    
    data = pd.DataFrame({
        'brushing_frequency': brushing_frequency,
        'flossing_frequency': flossing_frequency,
        'sugary_food_intake': sugary_food_intake,
        'smoking': smoking,
        'alcohol_consumption': alcohol_consumption,
        'gum_bleeding': gum_bleeding,
        'bad_breath': bad_breath,
        'dental_visits': dental_visits,
        'water_intake': water_intake,
        'mouth_ulcers': mouth_ulcers,
        'age': age,
        'knowledge_score': knowledge_score,
        'habit_score': habit_score,
        'consistency_score': consistency_score,
        'oral_health_score': oral_health_score
    })
    
    return data

def train_and_save_model():
    print("Generating synthetic dataset...")
    df = generate_synthetic_data(2500)
    
    X = df.drop('oral_health_score', axis=1)
    y = df['oral_health_score']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)
    
    print("\n--- Model Evaluation Metrics ---")
    print(f"Mean Absolute Error (MAE): {mae:.2f}")
    print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")
    print(f"R-squared Score (R2): {r2:.2f}")
    
    # Save Model
    model_path = os.path.join(os.path.dirname(__file__), 'oral_health_model.pkl')
    joblib.dump(model, model_path)
    print(f"\nModel saved successfully to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
