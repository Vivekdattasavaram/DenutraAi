import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
import auth, assessment, learning, chatbot, admin, notifications
from db_migrations import run_migrations

logger = logging.getLogger("oral_health_app")

app = FastAPI(
    title="Oral Health API",
    description="Backend API for the Oral Health application",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "https://Vivekdattasavaram.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(assessment.router)
app.include_router(learning.router)
app.include_router(chatbot.router)
app.include_router(admin.router)
app.include_router(notifications.router)

@app.on_event("startup")
def on_startup():
    """Run idempotent DB migrations and ensure tables exist on startup.
    Using startup event ensures migrations run in the same process and connection
    pool that FastAPI will use, avoiding drift between environments.
    """
    logger.info("Startup: running DB migrations")
    try:
        run_migrations()
    except Exception:
        logger.exception("DB migrations failed on startup")
        raise

    logger.info("Startup: creating ORM tables (metadata.create_all)")
    try:
        models.Base.metadata.create_all(bind=engine)
    except Exception:
        logger.exception("Failed to create tables on startup; continuing")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Oral Health API. Visit /docs for Swagger UI."}
