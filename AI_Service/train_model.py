import os
import pickle
from models.crop_classifier import PurePythonRandomForest

# Ensure the models directory exists
os.makedirs('models', exist_ok=True)

print("Instantiating pure-Python crop recommendation classifier...")
model = PurePythonRandomForest()

model_path = os.path.join('models', 'crop_recommendation_model.pkl')
with open(model_path, 'wb') as f:
    pickle.dump(model, f)
print(f"Model saved successfully to {model_path}")
