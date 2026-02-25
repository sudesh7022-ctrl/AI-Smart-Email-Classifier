import pandas as pd
import requests
import io
import sys

def download_indic_glue_direct():
    print("Downloading IndicGLUE (XNLI translation subset) directly from GitHub...")
    
    # URL for the XNLI hindi training dataset in CSV format
    # Often repositories like AI4Bharat provide raw csv files 
    # Here we'll use a widely available public mirror of XNLI/IndicGLUE Hindi data
    
    # The HuggingFace datasets viewer gives us access to parquet files directly:
    parquet_url = "https://huggingface.co/datasets/ai4bharat/indic_glue/resolve/main/snli_translate/hi/train.parquet"
    
    try:
        print(f"Fetching from {parquet_url}...")
        response = requests.get(parquet_url)
        response.raise_for_status()
        
        print("Reading parquet data...")
        # Read the parquet bytes into a pandas dataframe
        df = pd.read_parquet(io.BytesIO(response.content))
        
        print("Processing data...")
        # Create the 'text' column from premise and hypothesis
        df['text'] = df['premise'] + " " + df['hypothesis']
        
        # Select the columns we need for train_model.py
        df_final = df[['text', 'label']]
        
        # Save to csv
        file_path = "dataset.csv"
        df_final.to_csv(file_path, index=False)
        print(f"Successfully downloaded and saved {len(df_final)} Hindi cross-lingual inference rows to {file_path}")
        
    except Exception as e:
        print(f"Error fetching direct dataset: {e}")
        print("Falling back to a smaller sample dataset for demonstration purposes...")
        create_fallback_dataset()

def create_fallback_dataset():
    # If internet fails, create a tiny valid dataset to prevent train_model.py from breaking entirely
    data = [
        {"text": "This is a great product I love it.", "label": 0},
        {"text": "मुझे यह उत्पाद बहुत पसंद आया।", "label": 0}, 
        {"text": "This is terrible and broken.", "label": 2},
        {"text": "यह भयंकर और टूटा हुआ है।", "label": 2},
        {"text": "The box is blue.", "label": 1},
        {"text": "बक्सा नीला है।", "label": 1}
    ]
    pd.DataFrame(data).to_csv("dataset.csv", index=False)
    print("Created a small fallback dataset.csv with English & Hindi samples.")

if __name__ == "__main__":
    download_indic_glue_direct()
