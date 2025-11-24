import typesense
import os
from django.conf import settings
from typing import Dict, List, Any

class SearchService:
    """Search service using Typesense for library and transcripts"""
    
    def __init__(self):
        """Initialize Typesense client"""
        self.client = typesense.Client({
            'nodes': [{
                'host': os.getenv('TYPESENSE_HOST', 'localhost'),
                'port': os.getenv('TYPESENSE_PORT', '8108'),
                'protocol': os.getenv('TYPESENSE_PROTOCOL', 'http')
            }],
            'api_key': os.getenv('TYPESENSE_API_KEY', 'xyz'),
            'connection_timeout_seconds': 2
        })
    
    def create_library_collection(self):
        """Create collection for library books"""
        library_schema = {
            'name': 'library_books',
            'fields': [
                {'name': 'id', 'type': 'string'},
                {'name': 'title', 'type': 'string'},
                {'name': 'author', 'type': 'string'},
                {'name': 'isbn', 'type': 'string'},
                {'name': 'call_number', 'type': 'string'},
                {'name': 'description', 'type': 'string', 'optional': True},
                {'name': 'subject', 'type': 'string', 'optional': True},
                {'name': 'publisher', 'type': 'string', 'optional': True},
                {'name': 'publication_year', 'type': 'int32', 'optional': True},
                {'name': 'location', 'type': 'string', 'optional': True},
                {'name': 'status', 'type': 'string'},
                {'name': 'created_at', 'type': 'int64'}
            ],
            'default_sorting_field': 'created_at'
        }
        
        try:
            self.client.collections.create(library_schema)
            print("Library books collection created successfully")
        except Exception as e:
            if "already exists" in str(e):
                print("Library books collection already exists")
            else:
                print(f"Error creating library books collection: {e}")
    
    def create_transcripts_collection(self):
        """Create collection for academic transcripts"""
        transcripts_schema = {
            'name': 'transcripts',
            'fields': [
                {'name': 'id', 'type': 'string'},
                {'name': 'student_id', 'type': 'string'},
                {'name': 'student_name', 'type': 'string'},
                {'name': 'course_id', 'type': 'string'},
                {'name': 'course_name', 'type': 'string'},
                {'name': 'grade', 'type': 'string'},
                {'name': 'points', 'type': 'float'},
                {'name': 'semester', 'type': 'string'},
                {'name': 'year', 'type': 'int32'},
                {'name': 'instructor', 'type': 'string', 'optional': True},
                {'name': 'department', 'type': 'string', 'optional': True},
                {'name': 'created_at', 'type': 'int64'}
            ],
            'default_sorting_field': 'created_at'
        }
        
        try:
            self.client.collections.create(transcripts_schema)
            print("Transcripts collection created successfully")
        except Exception as e:
            if "already exists" in str(e):
                print("Transcripts collection already exists")
            else:
                print(f"Error creating transcripts collection: {e}")
    
    def index_library_book(self, book_data: Dict[str, Any]):
        """Index a library book in Typesense"""
        try:
            self.client.collections['library_books'].documents.create(book_data)
            return True
        except Exception as e:
            print(f"Error indexing library book: {e}")
            return False
    
    def index_transcript(self, transcript_data: Dict[str, Any]):
        """Index a transcript in Typesense"""
        try:
            self.client.collections['transcripts'].documents.create(transcript_data)
            return True
        except Exception as e:
            print(f"Error indexing transcript: {e}")
            return False
    
    def search_library_books(self, query: str, filters: Dict[str, Any] = None) -> List[Dict]:
        """Search library books"""
        search_parameters = {
            'q': query,
            'query_by': 'title,author,subject,isbn,call_number',
            'sort_by': 'created_at:desc'
        }
        
        if filters:
            filter_strings = []
            for key, value in filters.items():
                if isinstance(value, list):
                    filter_strings.append(f"{key}: [{','.join([str(v) for v in value])}]")
                else:
                    filter_strings.append(f"{key}: {value}")
            search_parameters['filter_by'] = ' && '.join(filter_strings)
        
        try:
            results = self.client.collections['library_books'].documents.search(search_parameters)
            return results['hits'] if 'hits' in results else []
        except Exception as e:
            print(f"Error searching library books: {e}")
            return []
    
    def search_transcripts(self, query: str, filters: Dict[str, Any] = None) -> List[Dict]:
        """Search transcripts"""
        search_parameters = {
            'q': query,
            'query_by': 'student_name,course_name,instructor',
            'sort_by': 'created_at:desc'
        }
        
        if filters:
            filter_strings = []
            for key, value in filters.items():
                if isinstance(value, list):
                    filter_strings.append(f"{key}: [{','.join([str(v) for v in value])}]")
                else:
                    filter_strings.append(f"{key}: {value}")
            search_parameters['filter_by'] = ' && '.join(filter_strings)
        
        try:
            results = self.client.collections['transcripts'].documents.search(search_parameters)
            return results['hits'] if 'hits' in results else []
        except Exception as e:
            print(f"Error searching transcripts: {e}")
            return []
    
    def delete_library_book(self, book_id: str) -> bool:
        """Delete a library book from the index"""
        try:
            self.client.collections['library_books'].documents[book_id].delete()
            return True
        except Exception as e:
            print(f"Error deleting library book: {e}")
            return False
    
    def delete_transcript(self, transcript_id: str) -> bool:
        """Delete a transcript from the index"""
        try:
            self.client.collections['transcripts'].documents[transcript_id].delete()
            return True
        except Exception as e:
            print(f"Error deleting transcript: {e}")
            return False

# Initialize the search service
search_service = SearchService()

# Create collections if they don't exist
def initialize_search_service():
    """Initialize the search service and create collections"""
    try:
        search_service.create_library_collection()
        search_service.create_transcripts_collection()
        print("Search service initialized successfully")
    except Exception as e:
        print(f"Error initializing search service: {e}")