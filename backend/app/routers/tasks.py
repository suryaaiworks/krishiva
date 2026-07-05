from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.task import DailyTaskResponse, DailyTaskCreate
from app.schemas.auth import StandardResponse
from app.repositories.notification_repo import NotificationRepository
from uuid import UUID
from typing import List

router = APIRouter(prefix="/tasks", tags=["Daily checklist Tasks"])

@router.get("", response_model=List[DailyTaskResponse])
def get_tasks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tasks = NotificationRepository.get_tasks(db, current_user.id)
    if not tasks:
        # Seed default dashboard operations
        NotificationRepository.create_task(db, current_user.id, "Apply nitrogen fertilizer mix to Sugarcane Zone B")
        NotificationRepository.create_task(db, current_user.id, "Inspect sugarcane foliage root zones for borer tunnels")
        NotificationRepository.create_task(db, current_user.id, "Schedule tractor rental booking for tomorrow's weeding")
        tasks = NotificationRepository.get_tasks(db, current_user.id)
    return tasks

@router.post("", response_model=DailyTaskResponse)
def create_task(
    payload: DailyTaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = NotificationRepository.create_task(db, current_user.id, payload.text)
    return task

@router.patch("/{task_id}/toggle", response_model=DailyTaskResponse)
def toggle_task(task_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = NotificationRepository.toggle_task(db, task_id)
    return task

@router.delete("/{task_id}", response_model=StandardResponse)
def delete_task(task_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    NotificationRepository.delete_task(db, task_id)
    return StandardResponse(success=True, message="Task deleted successfully.")
