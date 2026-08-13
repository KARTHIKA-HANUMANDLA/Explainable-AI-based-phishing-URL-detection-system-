from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import sys
import os

# Add project root to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.feature_extraction import predict_url


app = FastAPI(
    title="Phishing URL Detection API",
    description="ML-based phishing URL detection using XGBoost",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "model",
    "phishing_url_xgb_custom.pkl"
)

model = joblib.load(model_path)


class URLRequest(BaseModel):
    url: str


@app.get("/")
def home():
    return {
        "message": "Phishing URL Detection API is running"
    }


@app.post("/predict")
def predict(request: URLRequest):

    result = predict_url(
        request.url,
        model
    )

    prediction = result["prediction"]

    if prediction == 0:
        label = "Phishing"
    else:
        label = "Legitimate"

    return {
        "url": request.url,
        "prediction": label,
        "phishing_probability": result["phishing_probability"],
        "legitimate_probability": result["legitimate_probability"]
    }