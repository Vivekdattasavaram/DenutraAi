import random
import pandas as pd
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUTPUT_CSV = ROOT / 'oral_health_dataset.csv'
RECORDS = 3000


def generate_record():
    # Base behavior distributions
    brushing_frequency = random.choices([0, 1, 2, 3], weights=[5, 20, 50, 25])[0]
    flossing_frequency = random.choices(list(range(0, 8)), weights=[20, 15, 15, 15, 15, 10, 5, 5])[0]
    sugary_food_frequency = random.choices(list(range(0, 8)), weights=[15, 20, 25, 20, 10, 5, 3, 2])[0]
    gum_bleeding = random.choices([0, 1], weights=[80, 20])[0]
    dental_visits = random.choices([0, 1, 2, 3, 4], weights=[20, 35, 25, 12, 8])[0]
    brushing_duration = round(random.uniform(1.0, 5.0), 1)

    # Derived metrics
    consistency_score = round(random.uniform(40, 95), 1)
    assessment_score = round(
        (brushing_frequency * 15)
        + (flossing_frequency * 5)
        - (sugary_food_frequency * 5)
        - (gum_bleeding * 15)
        + (dental_visits * 5)
        + (brushing_duration * 6)
        + (consistency_score * 0.15),
        1
    )
    assessment_score = max(0.0, min(100.0, assessment_score))

    # Risk logic
    risk_value = (
        (3 - brushing_frequency) * 20
        + (7 - flossing_frequency) * 8
        + sugary_food_frequency * 7
        + gum_bleeding * 18
        + (3 - min(dental_visits, 3)) * 10
        - brushing_duration * 4
        - consistency_score * 0.12
    )
    risk_value = max(0, min(100, risk_value + random.uniform(-10, 10)))

    if risk_value <= 35:
        risk_level = 'Low Risk'
    elif risk_value <= 65:
        risk_level = 'Medium Risk'
    else:
        risk_level = 'High Risk'

    # Adjust with behavioral rules for realism
    if brushing_frequency <= 1 and sugary_food_frequency >= 5:
        risk_level = 'High Risk'
    if brushing_frequency >= 2 and flossing_frequency >= 4 and sugary_food_frequency <= 2 and gum_bleeding == 0 and dental_visits >= 1:
        risk_level = 'Low Risk'
    if brushing_frequency == 0 and flossing_frequency <= 1 and sugary_food_frequency >= 5:
        risk_level = 'High Risk'
    if risk_level == 'Low Risk' and assessment_score < 50:
        risk_level = 'Medium Risk'
    if risk_level == 'High Risk' and assessment_score > 70:
        risk_level = 'Medium Risk'

    return {
        'brushing_frequency': brushing_frequency,
        'flossing_frequency': flossing_frequency,
        'sugary_food_frequency': sugary_food_frequency,
        'gum_bleeding': gum_bleeding,
        'dental_visits': dental_visits,
        'brushing_duration': brushing_duration,
        'consistency_score': consistency_score,
        'assessment_score': assessment_score,
        'risk_level': risk_level,
    }


def generate_dataset(records=RECORDS):
    data = [generate_record() for _ in range(records)]
    df = pd.DataFrame(data)
    df.to_csv(OUTPUT_CSV, index=False)
    print(f'Generated {len(df)} records in {OUTPUT_CSV}')
    print('Dataset shape:', df.shape)
    print('Sample rows:')
    print(df.head(5).to_string(index=False))

    required_columns = [
        'brushing_frequency',
        'flossing_frequency',
        'sugary_food_frequency',
        'gum_bleeding',
        'dental_visits',
        'brushing_duration',
        'consistency_score',
        'assessment_score',
        'risk_level'
    ]
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        print('Missing columns:', missing_columns)
    else:
        print('All required columns are present.')


if __name__ == '__main__':
    generate_dataset()
