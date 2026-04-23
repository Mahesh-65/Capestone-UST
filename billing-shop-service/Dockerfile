FROM python:3.12-slim
WORKDIR /app
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY src /app/src
USER appuser
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8005"]
