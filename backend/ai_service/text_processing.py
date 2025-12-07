#!/usr/bin/env python3
"""
Text Processing Module for Digital Campus AI Services

This module implements text processing capabilities for content analysis in AI services.
"""

import re
import string
from typing import List, Dict, Any, Tuple
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer

# Download required NLTK data (would be run once during setup)
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')
# nltk.download('averaged_perceptron_tagger')

class TextProcessor:
    """
    Processes text for content analysis in AI services.
    """
    
    def __init__(self):
        """
        Initialize the Text Processor.
        """
        try:
            self.stop_words = set(stopwords.words('english'))
            self.stemmer = PorterStemmer()
            self.lemmatizer = WordNetLemmatizer()
            self.nltk_available = True
        except LookupError:
            # Fallback if NLTK data is not available
            self.stop_words = set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
            self.stemmer = None
            self.lemmatizer = None
            self.nltk_available = False
    
    def clean_text(self, text: str) -> str:
        """
        Clean text by removing special characters, extra whitespace, etc.
        
        Args:
            text: Input text to clean
            
        Returns:
            Cleaned text
        """
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove HTML tags
        text = re.sub(r'<.*?>', '', text)
        
        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def tokenize_text(self, text: str) -> List[str]:
        """
        Tokenize text into words.
        
        Args:
            text: Input text to tokenize
            
        Returns:
            List of tokens
        """
        if not text:
            return []
        
        if self.nltk_available:
            try:
                tokens = word_tokenize(text)
            except:
                tokens = text.split()
        else:
            tokens = text.split()
        
        return tokens
    
    def remove_stopwords(self, tokens: List[str]) -> List[str]:
        """
        Remove stopwords from tokens.
        
        Args:
            tokens: List of tokens
            
        Returns:
            List of tokens without stopwords
        """
        return [token for token in tokens if token not in self.stop_words]
    
    def stem_tokens(self, tokens: List[str]) -> List[str]:
        """
        Stem tokens to their root form.
        
        Args:
            tokens: List of tokens
            
        Returns:
            List of stemmed tokens
        """
        if self.stemmer and self.nltk_available:
            return [self.stemmer.stem(token) for token in tokens]
        return tokens  # Return unchanged if stemming not available
    
    def lemmatize_tokens(self, tokens: List[str]) -> List[str]:
        """
        Lemmatize tokens to their base form.
        
        Args:
            tokens: List of tokens
            
        Returns:
            List of lemmatized tokens
        """
        if self.lemmatizer and self.nltk_available:
            return [self.lemmatizer.lemmatize(token) for token in tokens]
        return tokens  # Return unchanged if lemmatization not available
    
    def extract_ngrams(self, tokens: List[str], n: int = 2) -> List[str]:
        """
        Extract n-grams from tokens.
        
        Args:
            tokens: List of tokens
            n: Size of n-grams (default: 2 for bigrams)
            
        Returns:
            List of n-grams
        """
        if len(tokens) < n:
            return []
        
        ngrams = []
        for i in range(len(tokens) - n + 1):
            ngram = ' '.join(tokens[i:i+n])
            ngrams.append(ngram)
        
        return ngrams
    
    def extract_key_phrases(self, text: str, max_phrases: int = 10) -> List[str]:
        """
        Extract key phrases from text using basic heuristics.
        
        Args:
            text: Input text
            max_phrases: Maximum number of phrases to extract
            
        Returns:
            List of key phrases
        """
        # Simple approach: extract noun phrases (if POS tagging available)
        # Fallback: extract frequent n-grams
        
        sentences = sent_tokenize(text) if self.nltk_available else [text]
        all_bigrams = []
        
        for sentence in sentences:
            cleaned = self.clean_text(sentence)
            tokens = self.tokenize_text(cleaned)
            tokens = self.remove_stopwords(tokens)
            bigrams = self.extract_ngrams(tokens, 2)
            all_bigrams.extend(bigrams)
        
        # Count frequency and return most common
        phrase_freq = Counter(all_bigrams)
        return [phrase for phrase, _ in phrase_freq.most_common(max_phrases)]
    
    def calculate_text_statistics(self, text: str) -> Dict[str, Any]:
        """
        Calculate various statistics about the text.
        
        Args:
            text: Input text
            
        Returns:
            Dictionary of text statistics
        """
        cleaned_text = self.clean_text(text)
        tokens = self.tokenize_text(cleaned_text)
        tokens_no_stop = self.remove_stopwords(tokens)
        
        sentences = sent_tokenize(text) if self.nltk_available else [text]
        
        stats = {
            'character_count': len(text),
            'word_count': len(tokens),
            'sentence_count': len(sentences),
            'unique_word_count': len(set(tokens_no_stop)),
            'avg_word_length': sum(len(token) for token in tokens) / len(tokens) if tokens else 0,
            'avg_sentence_length': len(tokens) / len(sentences) if sentences else 0,
            'lexical_diversity': len(set(tokens_no_stop)) / len(tokens_no_stop) if tokens_no_stop else 0,
        }
        
        return stats
    
    def preprocess_text(self, text: str, 
                       remove_stopwords: bool = True,
                       stem: bool = False,
                       lemmatize: bool = True) -> str:
        """
        Complete text preprocessing pipeline.
        
        Args:
            text: Input text
            remove_stopwords: Whether to remove stopwords
            stem: Whether to stem tokens
            lemmatize: Whether to lemmatize tokens
            
        Returns:
            Preprocessed text
        """
        # Clean text
        cleaned = self.clean_text(text)
        
        # Tokenize
        tokens = self.tokenize_text(cleaned)
        
        # Remove stopwords if requested
        if remove_stopwords:
            tokens = self.remove_stopwords(tokens)
        
        # Stem if requested
        if stem:
            tokens = self.stem_tokens(tokens)
        
        # Lemmatize if requested
        if lemmatize:
            tokens = self.lemmatize_tokens(tokens)
        
        # Join tokens back into text
        return ' '.join(tokens)

def analyze_course_content(course_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyze course content for AI services.
    
    Args:
        course_data: List of course dictionaries with title and description
        
    Returns:
        Dictionary with content analysis results
    """
    processor = TextProcessor()
    
    all_titles = []
    all_descriptions = []
    
    for course in course_data:
        title = course.get('title', '')
        description = course.get('description', '')
        
        if title:
            all_titles.append(title)
        if description:
            all_descriptions.append(description)
    
    # Combine all text
    combined_titles = ' '.join(all_titles)
    combined_descriptions = ' '.join(all_descriptions)
    
    # Analyze titles
    title_stats = processor.calculate_text_statistics(combined_titles)
    title_key_phrases = processor.extract_key_phrases(combined_titles, 15)
    
    # Analyze descriptions
    desc_stats = processor.calculate_text_statistics(combined_descriptions)
    desc_key_phrases = processor.extract_key_phrases(combined_descriptions, 20)
    
    # Overall vocabulary analysis
    all_text = combined_titles + ' ' + combined_descriptions
    cleaned_text = processor.clean_text(all_text)
    tokens = processor.tokenize_text(cleaned_text)
    tokens_no_stop = processor.remove_stopwords(tokens)
    
    vocabulary = list(set(tokens_no_stop))
    word_freq = Counter(tokens_no_stop)
    most_common_words = word_freq.most_common(25)
    
    return {
        'title_analysis': {
            'statistics': title_stats,
            'key_phrases': title_key_phrases
        },
        'description_analysis': {
            'statistics': desc_stats,
            'key_phrases': desc_key_phrases
        },
        'vocabulary': {
            'size': len(vocabulary),
            'most_common_words': most_common_words
        }
    }

def extract_course_topics(course_data: List[Dict[str, Any]], 
                         num_topics: int = 10) -> List[Dict[str, Any]]:
    """
    Extract potential topics from course data.
    
    Args:
        course_data: List of course dictionaries
        num_topics: Number of topics to extract
        
    Returns:
        List of topic dictionaries
    """
    processor = TextProcessor()
    
    # Collect all course descriptions
    descriptions = [course.get('description', '') for course in course_data if course.get('description')]
    
    if not descriptions:
        return []
    
    # Simple topic extraction based on frequent terms
    all_text = ' '.join(descriptions)
    cleaned_text = processor.preprocess_text(all_text)
    tokens = processor.tokenize_text(cleaned_text)
    
    # Remove stopwords and short tokens
    tokens = [token for token in tokens if len(token) > 3]
    tokens = processor.remove_stopwords(tokens)
    
    # Count frequencies
    word_freq = Counter(tokens)
    common_terms = word_freq.most_common(num_topics)
    
    # Create topic-like structures
    topics = []
    for i, (term, freq) in enumerate(common_terms):
        topics.append({
            'topic_id': f'topic_{i+1:02d}',
            'keywords': [term],
            'weight': freq,
            'description': f"Topic centered around '{term}'"
        })
    
    return topics

# Global instance of TextProcessor
text_processor = TextProcessor()

if __name__ == "__main__":
    # Example usage
    sample_courses = [
        {
            'course_id': 'CS101',
            'title': 'Introduction to Computer Science',
            'description': 'This course provides fundamental concepts of computer science and programming. Students will learn programming basics, algorithms, and problem-solving techniques.'
        },
        {
            'course_id': 'MATH201',
            'title': 'Calculus II',
            'description': 'Advanced calculus topics including integration techniques, series, and sequences. Applications to physics and engineering problems are emphasized.'
        },
        {
            'course_id': 'ENG101',
            'title': 'English Composition',
            'description': 'Writing and composition skills for academic and professional contexts. Focus on clarity, organization, and persuasive argumentation.'
        }
    ]
    
    # Analyze course content
    analysis = analyze_course_content(sample_courses)
    print("Content Analysis:")
    print(f"Vocabulary size: {analysis['vocabulary']['size']}")
    print(f"Most common words: {analysis['vocabulary']['most_common_words'][:5]}")
    print(f"Title key phrases: {analysis['title_analysis']['key_phrases'][:5]}")
    print(f"Description key phrases: {analysis['description_analysis']['key_phrases'][:5]}")
    
    # Extract topics
    topics = extract_course_topics(sample_courses, 5)
    print("\nExtracted Topics:")
    for topic in topics:
        print(f"- {topic['description']} (keywords: {topic['keywords']})")