FROM python:3.11-slim

WORKDIR /app

# Install build dependencies for scikit-learn
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy dataset and training script to generate model at build time
COPY dataset.csv .
COPY train_model.py .
RUN python train_model.py

COPY main.py .
COPY run.py .

EXPOSE 8000

CMD ["python", "run.py"]
