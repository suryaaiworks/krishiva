# Kisan Alert AI Backend

This is the FastAPI backend foundation for the Kisan Alert AI application.

## Structure
- `app/api/`: Endpoint routers.
- `app/controllers/`: Application logic controllers.
- `app/services/`: Third-party services and integrations (Gemini, Google Maps, Earth Engine).
- `app/repositories/`: Data access layer for Firestore.
- `app/models/`: Database models.
- `app/schemas/`: Pydantic validation schemas.
- `app/middleware/`: Custom middleware (auth, logging).
- `app/database/`: Database configuration and client initialization.
- `app/config/`: App settings and configuration.
- `app/agents/`: LangGraph agent workflows.
- `app/prompts/`: System prompts for AI agents.
- `app/utils/`: Helper functions and utilities.
