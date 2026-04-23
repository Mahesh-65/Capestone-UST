FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --prefix=/install -r /app/requirements.txt

FROM python:3.12-slim AS runner
WORKDIR /app
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
COPY --from=builder /install /usr/local
COPY src /app/src
USER appuser
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8005"]
