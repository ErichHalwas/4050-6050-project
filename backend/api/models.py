from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date = models.DateTimeField(null=False)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True,blank=True)
    location = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.title
