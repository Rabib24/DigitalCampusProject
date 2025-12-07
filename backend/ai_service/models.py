from django.db import models

class AIModelMetadata(models.Model):
    model_name = models.CharField(max_length=100)
    version = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    performance_metrics = models.JSONField()
    
    def __str__(self):
        return f"{self.model_name} v{self.version}"

class UserAIProfile(models.Model):
    user_id = models.CharField(max_length=50, db_index=True)
    preferences = models.JSONField()
    last_updated = models.DateTimeField(auto_now=True)
    
    # AI-specific fields
    interest_areas = models.JSONField(default=dict, blank=True)  # e.g., {"computer_science": 0.8, "mathematics": 0.6}
    learning_style = models.CharField(max_length=50, blank=True)  # e.g., "visual", "auditory", "kinesthetic"
    skill_levels = models.JSONField(default=dict, blank=True)     # e.g., {"programming": "intermediate", "math": "advanced"}
    goal_orientations = models.JSONField(default=dict, blank=True) # e.g., {"career": 0.7, "research": 0.3}
    content_preferences = models.JSONField(default=dict, blank=True) # e.g., {"video": 0.8, "text": 0.6, "interactive": 0.4}
    feedback_history = models.JSONField(default=list, blank=True)  # History of user feedback on recommendations
    recommendation_engagement = models.JSONField(default=dict, blank=True)  # Engagement metrics with recommendations
    
    def __str__(self):
        return f"AI Profile for user {self.user_id}"