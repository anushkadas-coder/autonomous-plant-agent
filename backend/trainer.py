import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
import joblib

def build_model():
    print("Generating sensor data...")
    n = 5000 # Increased data size
    
    # Generate random data
    data = {
        'vibration_score': np.random.uniform(20, 100, n),
        'heat_index': np.random.uniform(30, 110, n),
        'pressure_psi': np.random.uniform(50, 150, n),
        'failure': 0
    }
    df = pd.DataFrame(data)
    
    # We force more failures so the model can learn!
    # If vibration > 70 OR heat > 90, it's a failure
    df.loc[(df['vibration_score'] > 70) | (df['heat_index'] > 90), 'failure'] = 1
    
    # Check how many failures we have (should be more than zero now!)
    print(f"Total failures in training data: {df['failure'].sum()}")

    X = df.drop('failure', axis=1)
    y = df['failure']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    
    # Added base_score=0.5 to stop that specific error
    model = XGBClassifier(
        n_estimators=100, 
        max_depth=3, 
        learning_rate=0.1, 
        base_score=0.5 
    )
    
    model.fit(X_train, y_train)
    
    joblib.dump(model, "failure_model.pkl")
    print("Success! Brain trained and saved as failure_model.pkl")

if __name__ == "__main__":
    build_model()