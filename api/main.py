from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import joblib
import shap
import numpy as np
import sys
import os


# ============================================================
# Add project root to Python path
# ============================================================

sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)


# ============================================================
# Import feature extraction functions
# ============================================================

from src.feature_extraction import (
    extract_url_features,
    predict_url
)


# ============================================================
# FastAPI application
# ============================================================

app = FastAPI(
    title="Phishing URL Detection API",
    description="ML-based phishing URL detection using XGBoost",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Load trained model
# ============================================================

model_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "model",
    "phishing_url_xgb_custom.pkl"
)

model = joblib.load(model_path)


# ============================================================
# SHAP Explainer
# ============================================================

explainer = shap.TreeExplainer(model)


# ============================================================
# Feature names
# ============================================================

FEATURE_NAMES = [
    "URLLength",
    "DomainLength",
    "IsDomainIP",
    "TLDLength",
    "NoOfSubDomain",
    "HasObfuscation",
    "NoOfObfuscatedChar",
    "ObfuscationRatio",
    "NoOfLettersInURL",
    "LetterRatioInURL",
    "NoOfDegitsInURL",
    "DegitRatioInURL",
    "NoOfEqualsInURL",
    "NoOfQMarkInURL",
    "NoOfAmpersandInURL",
    "NoOfOtherSpecialCharsInURL",
    "SpacialCharRatioInURL",
    "IsHTTPS"
]


# ============================================================
# Request model
# ============================================================

class URLRequest(BaseModel):
    url: str


# ============================================================
# Home endpoint
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Phishing URL Detection API is running"
    }


# ============================================================
# Prediction endpoint
# ============================================================

@app.post("/predict")
def predict(request: URLRequest):

    url = request.url

    # --------------------------------------------------------
    # Get normal prediction
    # --------------------------------------------------------

    result = predict_url(
        url,
        model
    )

    prediction = result["prediction"]

    if prediction == 0:
        label = "Phishing"
    else:
        label = "Legitimate"


    # --------------------------------------------------------
    # Extract the same 18 features used by the model
    # --------------------------------------------------------

    feature_dict = extract_url_features(url)

    features = [
        feature_dict[name]
        for name in FEATURE_NAMES
    ]


    # --------------------------------------------------------
    # Convert features to NumPy array
    # --------------------------------------------------------

    X = np.array(
        features,
        dtype=float
    ).reshape(1, -1)


    # --------------------------------------------------------
    # Calculate SHAP values
    # --------------------------------------------------------

    shap_values = explainer.shap_values(X)


    # --------------------------------------------------------
    # Handle different SHAP output formats
    # --------------------------------------------------------

    if isinstance(shap_values, list):

        # Binary classification
        shap_array = np.array(
            shap_values[-1]
        )

    else:

        shap_array = np.array(
            shap_values
        )


    # Remove unnecessary dimensions
    shap_array = shap_array.flatten()


    # --------------------------------------------------------
    # Create explanation list
    # --------------------------------------------------------

    explanation = []

    for name, feature_value, shap_value in zip(
        FEATURE_NAMES,
        features,
        shap_array
    ):

        explanation.append({
            "feature": name,
            "value": float(feature_value),
            "impact": float(shap_value)
        })


    # --------------------------------------------------------
    # Sort by strongest impact
    # --------------------------------------------------------

    explanation.sort(
        key=lambda x: abs(x["impact"]),
        reverse=True
    )


    # --------------------------------------------------------
    # Return top 5 explanations
    # --------------------------------------------------------

    top_explanations = explanation[:5]


    # ========================================================
    # Final API response
    # ========================================================

    return {

        "url": url,

        "prediction": label,

        "phishing_probability": float(
            result["phishing_probability"]
        ),

        "legitimate_probability": float(
            result["legitimate_probability"]
        ),

        "explanation": top_explanations
    }