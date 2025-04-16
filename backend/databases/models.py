from django.db import models

# Create your models here.
class user_info(models.Model):
    username = models.CharField(max_length= 200)
    email = models.CharField(max_length= 200)
    password = models.CharField(max_length= 200)
    
    def __str__(self):
        return self.email
        
class event_info(models.Model):
    #event description
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=500)
    host = models.CharField(max_length=100)
    url = models.CharField(max_length=200)
    
    #date
    start_time = models.CharField(max_length=20)
    end_time = models.CharField(max_length=20)
    date = models.CharField(max_length=40)
    
    #location
    street = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=30)
    zipcode = models.CharField(max_length=10)
    latitude = models.CharField(max_length=10)
    longitude = models.CharField(max_length=10)
