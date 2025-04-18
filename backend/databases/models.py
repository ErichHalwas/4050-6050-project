from django.db import models

# Create your models here.
class user_info(models.Model):
    username = models.CharField(max_length= 200)
    email = models.CharField(max_length= 200)
    password = models.CharField(max_length= 200)
    
    def __str__(self):
        return self.username
        
class event_info(models.Model):
    #event description
    title = models.CharField(max_length=200,default = '')
    description = models.CharField(max_length=500, default = '')
    host = models.CharField(max_length=100, default = '')
    url = models.CharField(max_length=200, default = '')
    attending = models.IntegerField(default = 0,)
    
    #date
    start_time = models.CharField(max_length=20, default = '')
    end_time = models.CharField(max_length=20, default = '')
    time_zone = models.CharField(max_length = 35, default = '')
    date = models.CharField(max_length=40, default = '')
    
    #location
    room_num = models.CharField(max_length = 10, default = '')
    street = models.CharField(max_length=200,default = '')
    city = models.CharField(max_length=100, default = '')
    state = models.CharField(max_length=30, default = '')
    zipcode = models.CharField(max_length=10, default = '')
    latitude = models.CharField(max_length=15, default = '')
    longitude = models.CharField(max_length=15, default = '')
    
    def __str__(self):
        return self.title
