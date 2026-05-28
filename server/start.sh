#!/bin/bash
# Render.com start command — PORT is injected by Render automatically
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"
