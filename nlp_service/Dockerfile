FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Assuming pipeline.py contains a flask/fastapi app or an HTTP server
# Adjust the entrypoint/cmd as necessary. For now, running it with python.
# If it's uvicorn: CMD ["uvicorn", "pipeline:app", "--host", "0.0.0.0", "--port", "8000"]
# Using python for now, but user should adjust if needed.
ENV PORT=8000
EXPOSE 8000

CMD ["python", "pipeline.py"]
