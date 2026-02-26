from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os

app = FastAPI(title="AI Email Classifier Service", version="1.0.0")

class EmailRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    category: str
    confidence: float

# Ensure model files are loaded at startup
model_path = "model.pkl"
vec_path = "vectorizer.pkl"

if not os.path.exists(model_path) or not os.path.exists(vec_path):
    print(f"Server cannot start properly. {model_path} or {vec_path} is missing.")
else:
    model = joblib.load(model_path)
    vectorizer = joblib.load(vec_path)

@app.post("/predict", response_model=PredictionResponse)
def predict_email(request: EmailRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Email text cannot be empty")
        
    try:
        # Convert text to TF-IDF features
        vec_text = vectorizer.transform([request.text])
        
        # Predict Category
        prediction = model.predict(vec_text)[0]
        
        # Determine confidence score from probabilities
        probs = model.predict_proba(vec_text)[0]
        confidence = max(probs)
        
        return PredictionResponse(
            category=str(prediction),
            confidence=float(confidence)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "up"}

@app.get("/")
def root():
    return {
        "message": "AI Email Classifier API is running!",
        "endpoints": {
            "predict": "POST /predict",
            "health": "GET /health"
        }
    }
