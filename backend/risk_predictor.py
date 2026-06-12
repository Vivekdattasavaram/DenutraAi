from pathlib import Path

import joblib
import pandas as pd


class RiskPredictor:
    def __init__(self):
        model_path = Path(__file__).resolve().parent / 'risk_model.pkl'
        self.model = None
        if not model_path.exists():
            print(f'Risk model file not found at {model_path}')
            return

        try:
            self.model = joblib.load(model_path)
            print(f'Risk model loaded from {model_path}')
        except Exception as error:
            print(f'Failed to load risk model from {model_path}: {error}')

    def predict(self, features: dict) -> tuple[str, float]:
        if self.model is None:
            raise RuntimeError('Risk model is not loaded')

        df = pd.DataFrame([features])
        prediction = self.model.predict(df)[0]
        confidence = 0.0
        if hasattr(self.model, 'predict_proba'):
            probs = self.model.predict_proba(df)[0]
            confidence = float(max(probs))

        return str(prediction), confidence

    def is_ready(self) -> bool:
        return self.model is not None
