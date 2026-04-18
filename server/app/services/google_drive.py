import os
import json
import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaIoBaseUpload
from app.models.setting import Setting

class GoogleDriveService:
    def __init__(self):
        # Handle relative path for credentials
        self.credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        self.error_message = None
        
        if self.credentials_path and not os.path.isabs(self.credentials_path):
            # Resolve relative to the server root (where run.py is)
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.credentials_path = os.path.join(base_dir, self.credentials_path)
            
        self.scopes = ['https://www.googleapis.com/auth/drive'] 
        self.service = self._authenticate()

    def _authenticate(self):
        # 1. Check for raw JSON string (Best for Vercel/Heroku environment variables)
        json_content = os.getenv('GOOGLE_CREDENTIALS_JSON')
        if json_content:
            try:
                # If the string is double-escaped (common in some CI/CD), fix it
                if json_content.startswith('"') and json_content.endswith('"'):
                    json_content = json_content[1:-1].replace('\\"', '"')
                
                info = json.loads(json_content)
                creds = service_account.Credentials.from_service_account_info(
                    info, scopes=self.scopes
                )
                self.service_account_email = creds.service_account_email
                return build('drive', 'v3', credentials=creds)
            except Exception as e:
                self.error_message = f"Auth Error (JSON String): {str(e)}"
                print(f"CRITICAL: {self.error_message}")
                # Fall through to check file path if string auth fails

        # 2. Check for traditional file path
        if not self.credentials_path:
            if not self.error_message:
                self.error_message = "Neither GOOGLE_CREDENTIALS_JSON nor GOOGLE_APPLICATION_CREDENTIALS is set."
            print(f"CRITICAL: {self.error_message}")
            return None
            
        if not os.path.exists(self.credentials_path):
            self.error_message = f"Google Credentials file NOT FOUND at: {os.path.abspath(self.credentials_path)}"
            print(f"CRITICAL: {self.error_message}")
            return None
            
        try:
            creds = service_account.Credentials.from_service_account_file(
                self.credentials_path, scopes=self.scopes
            )
            self.service_account_email = creds.service_account_email
            return build('drive', 'v3', credentials=creds)
        except Exception as e:
            self.error_message = f"Auth Error (File): {str(e)}"
            print(f"CRITICAL: {self.error_message}")
            return None

    def get_timetables(self):
        # Fetch all settings that start with 'timetable_' and end with '_id'
        tt_settings = Setting.get_all_by_prefix('timetable_')
        
        file_ids = [s.value for s in tt_settings if s.key.endswith('_id')]
        
        # Fallback if none found (original defaults)
        if not file_ids:
            file_ids = ['13kxh1ef3rkI-Mrc2UrhlcOXpU4U9FQa7', '1kJu5eY9ceLd2FjYIZIbyrv3DFeHfhhcz']
        
        files = []
        for file_id in file_ids:
            try:
                file_data = self.service.files().get(
                    fileId=file_id, fields="id, name, webViewLink, mimeType"
                ).execute()
                files.append(file_data)
            except: continue
        return files

    def rename_file(self, file_id, new_name):
        """Renames a file on Google Drive."""
        try:
            self.service.files().update(
                fileId=file_id,
                body={'name': new_name}
            ).execute()
            return True
        except Exception as e:
            print(f"Rename Error: {e}")
            return False

    def update_file_content(self, file_id, file_bytes, mime_type='application/pdf'):
        """Overwrites the content of an existing file on Google Drive."""
        try:
            media = MediaIoBaseUpload(io.BytesIO(file_bytes), mimetype=mime_type, resumable=True)
            self.service.files().update(
                fileId=file_id,
                media_body=media
            ).execute()
            return True
        except Exception as e:
            print(f"Upload Error: {e}")
            return False

    def download_file(self, file_id):
        try:
            request = self.service.files().get_media(fileId=file_id)
            file_stream = io.BytesIO()
            downloader = MediaIoBaseDownload(file_stream, request)
            done = False
            while done is False:
                status, done = downloader.next_chunk()
            file_stream.seek(0)
            return file_stream.read()
        except: return None

    def get_folder_contents(self, folder_name):
        if not self.service: return []
        try:
            items = []
            if folder_name.upper() == 'S8':
                s8_course_id = Setting.get('s8_special_doc_id', '1AfXI58ik0elLXAwng3pCY9l2TC5XQCUn')
                try:
                    file_data = self.service.files().get(fileId=s8_course_id, fields="id, name, webViewLink, mimeType").execute()
                    file_data['name'] = f"[Course] {file_data['name']}"
                    items.append(file_data)
                except: pass

            query = f"name = '{folder_name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
            response = self.service.files().list(q=query, fields="files(id, name)").execute()
            folders = response.get('files', [])
            if not folders: return items
            folder_id = folders[0]['id']
            results = self.service.files().list(
                q=f"'{folder_id}' in parents and trashed = false",
                fields="files(id, name, webViewLink, mimeType)",
                orderBy="folder,name"
            ).execute()
            items.extend(results.get('files', []))
            return items
        except: return []
