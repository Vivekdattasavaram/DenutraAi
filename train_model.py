import json
import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    precision_score,
    recall_score,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / 'oral_health_dataset.csv'
MODEL_DIR = ROOT / 'fastapi_backend' / 'app' / 'ml'
MODEL_PATH = MODEL_DIR / 'risk_model.pkl'
CONFUSION_PATH = MODEL_DIR / 'confusion_matrix.png'
FEATURE_PATH = MODEL_DIR / 'feature_importance.png'
METRICS_PATH = MODEL_DIR / 'ml_metrics.json'


def _to_serializable(value):
    if isinstance(value, (np.integer, np.floating)):
        return value.item()
    if isinstance(value, dict):
        return {k: _to_serializable(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_to_serializable(v) for v in value]
    return value


def train_model():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f'{DATA_PATH} not found. Run generate_dataset.py first.')

    df = pd.read_csv(DATA_PATH)
    print(f'Loaded dataset from {DATA_PATH}')
    print('Dataset shape:', df.shape)
    print('Columns:', df.columns.tolist())

    feature_columns = [
        'brushing_frequency',
        'flossing_frequency',
        'sugary_food_frequency',
        'gum_bleeding',
        'dental_visits',
        'brushing_duration',
        'consistency_score',
        'assessment_score'
    ]

    required_columns = feature_columns + ['risk_level']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f'Dataset is missing required columns: {missing_columns}')

    X = df[feature_columns]
    y = df['risk_level']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=True, random_state=42, stratify=y
    )

    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='macro', zero_division=0)
    recall = recall_score(y_test, y_pred, average='macro', zero_division=0)
    report_dict = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

    print(f'RandomForest accuracy: {accuracy:.4f}')
    print(f'Precision (macro): {precision:.4f}')
    print(f'Recall (macro): {recall:.4f}')
    print('Classification report:')
    print(classification_report(y_test, y_pred, zero_division=0))

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    labels = list(model.classes_)
    cm = confusion_matrix(y_test, y_pred, labels=labels)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    plt.tight_layout()
    plt.savefig(CONFUSION_PATH)
    plt.close()

    importance = model.feature_importances_
    plt.figure(figsize=(10, 6))
    sns.barplot(x=importance, y=feature_columns)
    plt.title('Feature Importances')
    plt.xlabel('Importance')
    plt.ylabel('Feature')
    plt.tight_layout()
    plt.savefig(FEATURE_PATH)
    plt.close()

    metrics = {
        'accuracy': accuracy,
        'precision_macro': precision,
        'recall_macro': recall,
        'classification_report': report_dict,
        'feature_importances': dict(zip(feature_columns, importance.tolist())),
        'model_path': str(MODEL_PATH),
        'confusion_matrix_path': str(CONFUSION_PATH),
        'feature_importance_path': str(FEATURE_PATH)
    }

    with open(METRICS_PATH, 'w') as metrics_file:
        json.dump(_to_serializable(metrics), metrics_file, indent=2)

    print(f'Model saved to {MODEL_PATH}')
    print(f'Metrics saved to {METRICS_PATH}')
    print(f'Confusion matrix saved to {CONFUSION_PATH}')
    print(f'Feature importance saved to {FEATURE_PATH}')


if __name__ == '__main__':
    train_model()
