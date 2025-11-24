from django.urls import path
from search_views import search_library_books, search_transcripts, index_library_book, index_transcript

urlpatterns = [
    path('library-books/', search_library_books, name='search_library_books'),
    path('transcripts/', search_transcripts, name='search_transcripts'),
    path('index-library-book/', index_library_book, name='index_library_book'),
    path('index-transcript/', index_transcript, name='index_transcript'),
]