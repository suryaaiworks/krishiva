import os
import uuid
import logging
from app.database.supabase import get_supabase

logger = logging.getLogger(__name__)

# Config local mock path for storage fallback
MOCK_STORAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static_uploads"))
os.makedirs(MOCK_STORAGE_DIR, exist_ok=True)

class StorageService:
    @staticmethod
    def upload_file(bucket_name: str, file_name: str, file_bytes: bytes, content_type: str = "image/jpeg") -> str:
        """
        Uploads file to Supabase Storage bucket and returns public access URL.
        Falls back to local file storage if Supabase client is not available.
        """
        client = get_supabase()
        unique_name = f"{uuid.uuid4()}_{file_name}"
        
        if client is not None:
            try:
                # Upload to Supabase Bucket
                response = client.storage.from_(bucket_name).upload(
                    path=unique_name,
                    file=file_bytes,
                    file_options={"content-type": content_type}
                )
                # Retrieve Public URL
                public_url = client.storage.from_(bucket_name).get_public_url(unique_name)
                logger.info(f"File {file_name} uploaded successfully to Supabase bucket '{bucket_name}'. URL: {public_url}")
                return public_url
            except Exception as e:
                logger.error(f"Supabase Storage upload failed: {e}. Falling back to local storage.")
        
        # Local mock storage fallback
        try:
            local_bucket_dir = os.path.join(MOCK_STORAGE_DIR, bucket_name)
            os.makedirs(local_bucket_dir, exist_ok=True)
            
            local_file_path = os.path.join(local_bucket_dir, unique_name)
            with open(local_file_path, "wb") as f:
                f.write(file_bytes)
                
            # Mock URL representing local host
            mock_url = f"http://127.0.0.1:8001/static_uploads/{bucket_name}/{unique_name}"
            logger.info(f"File {file_name} saved locally as fallback: {mock_url}")
            return mock_url
        except Exception as e:
            logger.error(f"Local storage fallback failed: {e}")
            raise Exception("File upload failed.")
