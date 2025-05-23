from django.db import models
from django.utils import timezone
import traceback

# Create your models here.
class User_Info(models.Model):
    @property
    def is_authenticated(self):
        return True

    username = models.CharField(max_length= 48, primary_key = True)
    email = models.CharField(max_length=128, unique=True)
    password = models.CharField(max_length= 64)
    pfp_url = models.ImageField(
        upload_to='pfps/',
        blank=True,
        null=True,
        default='pfps/default.jpg'
    )

    def __str__(self):
        return self.username + '|' + self.email + '|' + self.password
        #return self.username
 

class Event_Info(models.Model):
    #event description
    title = models.CharField(max_length=128,default = '')
    description = models.CharField(max_length=5120, default = '')
    host = models.ForeignKey(User_Info, on_delete=models.CASCADE, related_name='events_hosted')
    url = models.CharField(max_length=256, default = '')
    attendees = models.ManyToManyField(User_Info, related_name='events_attending', blank=True)
    saved_by = models.ManyToManyField(User_Info, related_name='saved_events', blank=True)

    image_url = models.ImageField(
        upload_to='event_images/',
        blank=True,
        null=True,
        default='event_images/default.jpg'
    )

    #date
    start_time = models.DateTimeField(default = timezone.now, null = False)
    end_time = models.DateTimeField(default = timezone.now, null = False)
    time_zone = models.CharField(max_length = 64, default = 'US/Eastern')
    
    #location
    street = models.CharField(max_length=256,default = '')
    city = models.CharField(max_length=128, default = '')
    state = models.CharField(max_length=64, default = '')
    zipcode = models.CharField(max_length=10, default = '')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0)
    created_at = models.DateTimeField(default = timezone.now)
    updated_at = models.DateTimeField(default = timezone.now)
    
    
    def __str__(self):
        return self.title + '|' + self.description + '|' + self.host + '|' + self.url \
        + '|' + str(self.attendees) + '|' + str(self.start_time) + '|' + str(self.end_time) + '|' + str(self.time_zone) \
        + '|' + self.street + '|' + self.city + '|' + self.state + '|' + str(self.zipcode) + '|' + str(self.latitude) \
        + '|' + str(self.longitude) + '|' + str(self.created_at) + '|' + str(self.updated_at)
        #return self.title
            