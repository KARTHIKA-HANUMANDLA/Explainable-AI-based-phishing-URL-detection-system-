# 🛡️ PhishGuard AI

## Explainable AI-Based Phishing URL Detection System

PhishGuard AI is an end-to-end machine learning cybersecurity application designed to detect whether a given URL is **Phishing** or **Legitimate**.

The system analyzes URL characteristics using an **18-feature URL feature extraction pipeline**, classifies the URL using an **XGBoost machine learning model**, and uses **SHAP (SHapley Additive exPlanations)** to explain which URL features influenced the model's prediction.

The project combines **Machine Learning, Feature Engineering, Explainable AI, FastAPI, and Frontend Web Development** into a real-time phishing URL detection system.

---

## 🚀 Project Overview

Phishing attacks are one of the most common cybersecurity threats. Attackers often create deceptive URLs that imitate trusted websites in order to steal passwords, banking information, credentials, and other sensitive data.

Traditional blacklist-based systems may fail when a newly created phishing URL has not yet been reported.

PhishGuard AI uses a machine learning approach that analyzes the **structural characteristics of URLs** and identifies patterns commonly associated with phishing websites.

### How it works

1. User enters a URL.
2. The system extracts 18 URL-based features.
3. The extracted features are passed to an XGBoost classifier.
4. The model predicts whether the URL is phishing or legitimate.
5. Phishing and legitimate probabilities are calculated.
6. SHAP generates an explanation of the prediction.
7. The result and explanation are displayed through the web interface.

---

# ✨ Key Features

- 🔍 Real-time phishing URL detection
- 🧠 XGBoost machine learning classifier
- 🔢 18 URL-based features
- 📊 99.22% classification accuracy
- 📈 99.79% ROC-AUC
- 🎯 99.32% F1 Score
- 🔬 SHAP Explainable AI
- ⚡ FastAPI REST API
- 🎨 Interactive cybersecurity-themed frontend
- 📊 Phishing and legitimate probability scores
- 🔐 Real-time URL feature extraction
- 📱 Responsive frontend design
- 💡 Security recommendations based on prediction
- 🧪 Live feature-extraction validation

---

# 🧠 Machine Learning

The project uses the **PhiUSIIL Phishing URL Dataset** for training and evaluation.

The machine learning pipeline consists of:

```text
Dataset
   ↓
Data Preprocessing
   ↓
Feature Extraction
   ↓
18 URL Features
   ↓
XGBoost Classifier
   ↓
Model Evaluation
   ↓
Saved Model
   ↓
FastAPI
   ↓
Real-Time Prediction
```

---

# 🔢 18 URL Features

The following 18 URL-based features are extracted:

| # | Feature |
|---|---|
| 1 | URLLength |
| 2 | DomainLength |
| 3 | IsDomainIP |
| 4 | TLDLength |
| 5 | NoOfSubDomain |
| 6 | HasObfuscation |
| 7 | NoOfObfuscatedChar |
| 8 | ObfuscationRatio |
| 9 | NoOfLettersInURL |
| 10 | LetterRatioInURL |
| 11 | NoOfDegitsInURL |
| 12 | DegitRatioInURL |
| 13 | NoOfEqualsInURL |
| 14 | NoOfQMarkInURL |
| 15 | NoOfAmpersandInURL |
| 16 | NoOfOtherSpecialCharsInURL |
| 17 | SpacialCharRatioInURL |
| 18 | IsHTTPS |

These features capture different characteristics of a URL, including:

- URL length
- Domain length
- Domain structure
- Number of subdomains
- HTTPS usage
- Number of digits
- Number of letters
- Special characters
- Character ratios
- URL obfuscation
- IP-based domains

---

# 📊 Model Performance

The final XGBoost model achieved the following results:

| Metric | Score |
|---|---:|
| Accuracy | **99.22%** |
| Precision | **99.16%** |
| Recall | **99.48%** |
| F1 Score | **99.32%** |
| ROC-AUC | **99.79%** |

### Evaluation Results

```text
Accuracy  : 0.9921754066
Precision : 0.9915733452
Recall    : 0.9947719689
F1 Score  : 0.9931700816
ROC-AUC   : 0.9978566176
```

These results demonstrate that the model performs strongly on the evaluated dataset.

---

# 🔬 Explainable AI with SHAP

One of the main features of PhishGuard AI is **Explainable Artificial Intelligence (XAI)**.

Machine learning models can make accurate predictions while behaving like a black box. PhishGuard AI addresses this by using **SHAP (SHapley Additive exPlanations)**.

SHAP calculates the contribution of individual features toward the model's prediction.

For example, an explanation returned by the API may look like:

```text
URLLength              +8.026
DomainLength           -4.084
IsHTTPS                 +1.378
NoOfDegitsInURL         +0.250
DegitRatioInURL         -0.188
```

The frontend converts these values into an interactive explanation section.

This helps answer:

> **Why did the model make this prediction?**

Instead of only showing:

```text
Prediction: Phishing
```

the system also provides information about the URL characteristics that influenced the model.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       USER            │
                         │    Enters URL         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      FRONTEND        │
                         │    HTML / CSS / JS   │
                         └──────────┬───────────┘
                                    │
                              HTTP POST
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       FASTAPI        │
                         │      REST API        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │  FEATURE EXTRACTION  │
                         │      18 Features     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       XGBOOST        │
                         │   CLASSIFICATION     │
                         └──────────┬───────────┘
                                    │
                         ┌──────────┴───────────┐
                         │                      │
                         ▼                      ▼
                ┌─────────────────┐   ┌─────────────────┐
                │   PREDICTION    │   │      SHAP       │
                │                 │   │   EXPLANATION   │
                └────────┬────────┘   └────────┬────────┘
                         │                     │
                         └──────────┬──────────┘
                                    ▼
                         ┌──────────────────────┐
                         │      FRONTEND        │
                         │  Result + Confidence │
                         │  + SHAP Explanation  │
                         └──────────────────────┘
```

---

# 📁 Project Structure

```text
PHISHING/
│
├── api/
│   └── main.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── model/
│   └── phishing_url_xgb_custom.pkl
│
├── src/
│   └── feature_extraction.py
│
├── notebooks/
│   └── day2_dataset_analysis.ipynb
│
├── documentation.docx
│
├── requirements.txt
│
├── .gitignore
│
└── README.md
```

---

# 🛠️ Technology Stack

## Machine Learning

- Python
- XGBoost
- Scikit-learn
- Pandas
- NumPy
- SHAP
- Joblib

## Backend

- FastAPI
- Uvicorn
- Pydantic
- Python

## Frontend

- HTML5
- CSS3
- JavaScript
- Google Fonts

## Development & Version Control

- VS Code
- Jupyter Notebook
- Git
- GitHub
- Python Virtual Environment

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual GitHub repository URL.

Example:

```bash
git clone https://github.com/USERNAME/PHISHING.git
```

---

## 2. Navigate to the Project

```bash
cd PHISHING
```

---

## 3. Create a Virtual Environment

```bash
python -m venv venv
```

---

## 4. Activate the Virtual Environment

### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution, run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

Then activate again:

```powershell
.\venv\Scripts\Activate.ps1
```

---

## 5. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# ▶️ Running the Application

The application uses two components:

1. FastAPI backend
2. Frontend web server

Both should be running at the same time.

---

## Terminal 1 — Start FastAPI

From the project root:

```powershell
python -m uvicorn api.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

---

## FastAPI Swagger Documentation

FastAPI automatically provides interactive API documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

From Swagger UI, you can test:

```text
POST /predict
```

---

## Terminal 2 — Start Frontend

From the project root:

```powershell
python -m http.server 5501 --bind 127.0.0.1
```

Open the frontend:

```text
http://127.0.0.1:5501/frontend/index.html
```

---

# 🔌 API

## Base URL

```text
http://127.0.0.1:8000
```

---

## GET /

Checks whether the API is running.

### Response

```json
{
    "message": "Phishing URL Detection API is running"
}
```

---

# 📡 POST /predict

Analyzes a URL and returns its classification.

### Request

```json
{
    "url": "https://www.google.com"
}
```

### Example Legitimate Response

```json
{
    "url": "https://www.google.com",
    "prediction": "Legitimate",
    "phishing_probability": 0.0041738152503967285,
    "legitimate_probability": 0.9958261847496033,
    "explanation": [
        {
            "feature": "URLLength",
            "value": 22,
            "impact": 8.02589225769043
        },
        {
            "feature": "DomainLength",
            "value": 14,
            "impact": -4.083827972412109
        },
        {
            "feature": "IsHTTPS",
            "value": 1,
            "impact": 1.3776758909225464
        },
        {
            "feature": "NoOfDegitsInURL",
            "value": 0,
            "impact": 0.24972060322761536
        },
        {
            "feature": "DegitRatioInURL",
            "value": 0,
            "impact": -0.18750126659870148
        }
    ]
}
```

---

# 🧪 Example Predictions

## Example 1 — Legitimate URL

Input:

```text
https://www.google.com
```

Expected result:

```text
Prediction: Legitimate
```

Example probabilities:

```text
Phishing Probability   : 0.42%
Legitimate Probability : 99.58%
```

---

## Example 2 — Legitimate URL

Input:

```text
https://www.wikipedia.org
```

Expected result:

```text
Prediction: Legitimate
```

---

## Example 3 — Phishing URL

Input:

```text
http://paypal-login-security.com
```

Expected result:

```text
Prediction: Phishing
```

Example probabilities:

```text
Phishing Probability   : 99.99%
Legitimate Probability : 0.01%
```

---

## Example 4 — Suspicious URL

Input:

```text
http://example.com
```

The model can analyze the URL characteristics and return the corresponding prediction and probabilities.

---

# 🧪 Live Feature Extraction Validation

During development, an important problem was identified:

> The features calculated during live prediction did not initially match the values used in the original dataset.

This caused incorrect model predictions for URLs that should have been classified correctly.

The feature extraction pipeline was therefore compared against the original dataset feature calculations.

The mismatched features were identified and corrected.

The major mismatches included:

- URLLength
- NoOfLettersInURL
- LetterRatioInURL
- NoOfOtherSpecialCharsInURL
- SpacialCharRatioInURL
- DegitRatioInURL

After fixing the extraction logic, the live feature extraction pipeline was validated.

### Validation Result

```text
Live Feature-Extraction Accuracy: 1.0
```

### Confusion Matrix

```text
[[50  0]
 [ 0 50]]
```

This validation confirmed that the live feature extraction logic correctly reproduced the expected feature values for the validation URLs.

---

# 🔍 Feature Extraction Consistency

The final system uses the same feature definitions during training and inference.

```text
                 TRAINING
                    │
                    ▼
            Dataset Feature
              Calculation
                    │
                    ▼
             18 Features
                    │
                    ▼
             XGBoost Model
                    │
                    │
                    │
                 INFERENCE
                    │
                    ▼
              User URL
                    │
                    ▼
            Live Feature
              Extraction
                    │
                    ▼
             Same 18 Features
                    │
                    ▼
             XGBoost Model
```

Maintaining consistency between training-time and inference-time feature extraction is critical for reliable machine learning predictions.

---

# 🎨 Frontend

The frontend was designed as a modern cybersecurity dashboard.

### Main UI components

- PhishGuard AI branding
- AI engine status indicator
- URL input field
- Scan button
- Animated scanning state
- Threat analysis result
- Threat confidence score
- Phishing probability bar
- Legitimate probability bar
- Security recommendation
- SHAP explanation section
- Feature contribution bars
- Responsive mobile layout

---

# 🔬 SHAP Visualization

The frontend displays the strongest model feature contributions.

Positive and negative SHAP impacts are visually differentiated.

For example:

```text
URLLength
████████████████████  +8.026

DomainLength
██████████             -4.084

IsHTTPS
██████                 +1.378
```

This gives users an intuitive view of which features had the strongest influence on the model.

---

# 🔐 Security Recommendation

When a URL is classified as phishing, the application warns users not to provide sensitive information.

Example:

```text
This URL shows characteristics associated with phishing.
Avoid entering passwords, banking information, or personal data.
```

For legitimate predictions:

```text
Our model did not detect strong phishing indicators in this URL.
Always verify the website before entering sensitive information.
```

---


# 💡 Why PhishGuard AI?

The main objective of PhishGuard AI is to build a cybersecurity system that is not only accurate but also **interpretable**.

A traditional classifier may simply return:

```text
Phishing
```

PhishGuard AI goes one step further by providing:

```text
Prediction
+
Probability
+
Feature Contributions
+
Security Recommendation
```

This makes the system easier to understand and more useful for users and cybersecurity applications.

---



# 📝 Important Development Challenge

One of the major challenges during development was ensuring that the **18 features calculated from a live URL exactly matched the feature definitions used in the training dataset**.

Initial testing showed mismatches in several features, particularly:

```text
URLLength
NoOfLettersInURL
LetterRatioInURL
NoOfOtherSpecialCharsInURL
SpacialCharRatioInURL
DegitRatioInURL
```

For example, the initial implementation produced different URL lengths and letter counts compared with the dataset.

The feature extraction functions were systematically compared against actual dataset values for the same URLs.

After identifying the differences, the extraction logic was corrected.

This improved the reliability of real-time inference and ensured that the model received features in the same format during training and prediction.

---

# 🧪 Testing

The system was tested at multiple levels.

### Model Testing

The trained model was evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC

### Feature Testing

Live feature extraction was compared against known dataset values.

### API Testing

The FastAPI `/predict` endpoint was tested using Swagger UI.

### Frontend Testing

The frontend was tested using:

- Legitimate URLs
- Phishing URLs
- Empty input
- API connection
- Prediction display
- Probability visualization
- SHAP explanations

---

# 📦 API Response Structure

The prediction API returns:

```text
url
prediction
phishing_probability
legitimate_probability
explanation
```

The explanation contains:

```text
feature
value
impact
```

This structure allows the frontend to dynamically display the model decision and its explanation.

---

# 🛡️ Responsible Use

PhishGuard AI is intended for:

- Educational purposes
- Research
- Cybersecurity experimentation
- Machine learning demonstrations
- Portfolio projects

The system should not be treated as the sole security mechanism for protecting sensitive systems or users.

Always use established cybersecurity tools and verify suspicious websites independently.

---

# 📄 License

This project is intended for educational, research, and portfolio purposes.

---


