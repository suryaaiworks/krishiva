from sqlalchemy.orm import Session
from app.models.task import DailyTask, Notification
from app.models.conversation import ConversationHistory, VoiceSession, UploadedImage, UploadedDocument
from uuid import UUID
from typing import Optional, List
import datetime

class NotificationRepository:
    # --- Notifications ---
    @staticmethod
    def get_notifications(db: Session, user_id: UUID) -> List[Notification]:
        return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

    @staticmethod
    def create_notification(db: Session, user_id: UUID, n_type: str, category: str, title: str, message: str, date: str, action_label: str = None, action_href: str = None) -> Notification:
        noti = Notification(
            user_id=user_id,
            type=n_type,
            category=category,
            title=title,
            message=message,
            date=date,
            action_label=action_label,
            action_href=action_href
        )
        db.add(noti)
        db.commit()
        db.refresh(noti)
        return noti

    @staticmethod
    def mark_all_read(db: Session, user_id: UUID):
        db.query(Notification).filter(Notification.user_id == user_id).update({Notification.is_read: True})
        db.commit()

    @staticmethod
    def toggle_read(db: Session, noti_id: UUID) -> Optional[Notification]:
        noti = db.query(Notification).filter(Notification.id == noti_id).first()
        if noti:
            noti.is_read = not noti.is_read
            db.commit()
            db.refresh(noti)
        return noti

    @staticmethod
    def delete_notification(db: Session, noti_id: UUID):
        db.query(Notification).filter(Notification.id == noti_id).delete()
        db.commit()

    @staticmethod
    def clear_all(db: Session, user_id: UUID):
        db.query(Notification).filter(Notification.user_id == user_id).delete()
        db.commit()

    # --- Daily Tasks ---
    @staticmethod
    def get_tasks(db: Session, user_id: UUID) -> List[DailyTask]:
        return db.query(DailyTask).filter(DailyTask.user_id == user_id).order_by(DailyTask.created_at.asc()).all()

    @staticmethod
    def create_task(db: Session, user_id: UUID, text: str) -> DailyTask:
        task = DailyTask(user_id=user_id, text=text, is_done=False)
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def toggle_task(db: Session, task_id: UUID) -> Optional[DailyTask]:
        task = db.query(DailyTask).filter(DailyTask.id == task_id).first()
        if task:
            task.is_done = not task.is_done
            db.commit()
            db.refresh(task)
        return task

    @staticmethod
    def delete_task(db: Session, task_id: UUID):
        db.query(DailyTask).filter(DailyTask.id == task_id).delete()
        db.commit()

    # --- Chat Conversation History ---
    @staticmethod
    def get_chat_history(db: Session, user_id: UUID) -> Optional[ConversationHistory]:
        return db.query(ConversationHistory).filter(ConversationHistory.user_id == user_id).first()

    @staticmethod
    def append_chat_message(db: Session, user_id: UUID, message_data: dict) -> ConversationHistory:
        hist = NotificationRepository.get_chat_history(db, user_id)
        if not hist:
            hist = ConversationHistory(user_id=user_id, messages=[message_data])
            db.add(hist)
        else:
            # We copy list to trigger sqlalchemy JSON mutation detection
            updated_messages = list(hist.messages)
            updated_messages.append(message_data)
            hist.messages = updated_messages
            hist.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(hist)
        return hist

    # --- Voice Session Logs ---
    @staticmethod
    def create_voice_session(db: Session, user_id: UUID, language: str, audio_url: str = None, transcript: str = None, ai_response: str = None) -> VoiceSession:
        session = VoiceSession(
            user_id=user_id,
            language=language,
            audio_url=audio_url,
            transcript=transcript,
            ai_response=ai_response
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def get_voice_sessions(db: Session, user_id: UUID) -> List[VoiceSession]:
        return db.query(VoiceSession).filter(VoiceSession.user_id == user_id).order_by(VoiceSession.created_at.desc()).all()

    # --- Image Upload Registries ---
    @staticmethod
    def log_image_upload(db: Session, user_id: UUID, bucket: str, path: str, url: str, f_type: str) -> UploadedImage:
        img = UploadedImage(user_id=user_id, bucket_name=bucket, file_path=path, file_url=url, file_type=f_type)
        db.add(img)
        db.commit()
        db.refresh(img)
        return img

    # --- Document Upload Registries ---
    @staticmethod
    def log_document_upload(db: Session, user_id: UUID, bucket: str, path: str, url: str, f_type: str) -> UploadedDocument:
        doc = UploadedDocument(user_id=user_id, bucket_name=bucket, file_path=path, file_url=url, file_type=f_type)
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return doc
