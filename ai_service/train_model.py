import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

def train():
    print("Loading dataset...")
    df = pd.read_csv("dataset.csv")
    
    # Drop any null values just in case
    df.dropna(inplace=True)
    
    X = df['text']
    y = df['label']
    
    # Split the dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Initialize and fit TF-IDF vectorizer
    print("Vectorizing text...")
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # Initialize and train the internal model
    print("Training Naive Bayes model...")
    model = MultinomialNB()
    model.fit(X_train_vec, y_train)
    
    # Evaluate accuracy
    y_pred = model.predict(X_test_vec)
    print("Accuracy: ", accuracy_score(y_test, y_pred))
    print("\nClassification Report:\n", classification_report(y_test, y_pred, zero_division=0))
    
    # Save the model and vectorizer
    print("Saving model and vectorizer...")
    joblib.dump(model, "model.pkl")
    joblib.dump(vectorizer, "vectorizer.pkl")
    print("Done!")

if __name__ == "__main__":
    train()
