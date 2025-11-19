from django.db import models
from django.utils import timezone


class Publication(models.Model):
    """Publication model for faculty research"""
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=300)
    authors = models.JSONField(null=True, blank=True)  # array of author names/IDs
    abstract = models.TextField(blank=True)
    publication_date = models.DateField()
    journal = models.CharField(max_length=200, blank=True)
    volume = models.CharField(max_length=50, blank=True)
    issue = models.CharField(max_length=50, blank=True)
    pages = models.CharField(max_length=50, blank=True)
    doi = models.CharField(max_length=200, blank=True)
    isbn = models.CharField(max_length=50, blank=True)
    publisher = models.CharField(max_length=200, blank=True)
    research_project_id = models.CharField(max_length=50, blank=True)  # reference to ResearchProject
    faculty_ids = models.JSONField(null=True, blank=True)  # array of faculty IDs
    keywords = models.JSONField(null=True, blank=True)  # array of keywords
    citations = models.IntegerField(default=0)
    document_url = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    
    def add_author(self, author):
        """Add an author to the publication"""
        if self.authors is None:
            self.authors = []
        if isinstance(self.authors, list) and author not in self.authors:
            self.authors.append(author)
            self.save()
    
    def add_keyword(self, keyword):
        """Add a keyword to the publication"""
        if self.keywords is None:
            self.keywords = []
        if isinstance(self.keywords, list) and keyword not in self.keywords:
            self.keywords.append(keyword)
            self.save()
    
    def increment_citations(self):
        """Increment the citation count"""
        self.citations += 1
        self.save()
    
    def to_json(self):
        """Convert publication to JSON format"""
        # Convert date fields to string representations
        publication_date_str = None
        created_at_str = None
        updated_at_str = None
        
        try:
            if self.publication_date:
                publication_date_str = str(self.publication_date)
        except:
            pass
            
        try:
            if self.created_at:
                created_at_str = str(self.created_at)
        except:
            pass
            
        try:
            if self.updated_at:
                updated_at_str = str(self.updated_at)
        except:
            pass
        
        return {
            'id': self.id,
            'title': self.title,
            'authors': self.authors,
            'abstract': self.abstract,
            'publication_date': publication_date_str,
            'journal': self.journal,
            'volume': self.volume,
            'issue': self.issue,
            'pages': self.pages,
            'doi': self.doi,
            'isbn': self.isbn,
            'publisher': self.publisher,
            'research_project_id': self.research_project_id,
            'faculty_ids': self.faculty_ids,
            'keywords': self.keywords,
            'citations': self.citations,
            'document_url': self.document_url,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
        }
    
    def __str__(self):
        return f"Publication: {self.title}"