from django.db import models
from django.utils import timezone
import traceback

# Create your models here.
class User_Info(models.Model):
    username = models.CharField(max_length= 48, primary_key = True)
    email = models.CharField(max_length= 128)
    password = models.CharField(max_length= 64)
    
    def __str__(self):
        return self.username + '|' + self.email + '|' + self.password
        #return self.username
 
"""
    def get_user_by_username(username):
        return User_Info.objects.get(username = username)
    
    def get_user_by_email(email):
        return User_Info.objects.get(email = email)
    
    def validate_by_username(username,password):
        users = User_Info.objects.filter(username = username, password = password)
        if users.count() != 1:
            print("username, password not found")
            return False
        
        return True
    
    def delete_by_username(username):
        rtn_flag = False
        try:
            if type(username) != str:
                raise Exception("username parameter should be string")
            users = User_Info.objects.filter(username = username)
            if users.count() == 0:
                print("user does not exists")
                rtn_flag = False
            else:
                for user in users:
                    user.delete()
                    print("user deleted")
                    rtn_flag = True                
        except Exception:
            print(traceback.format_exc())
            rtn_flag = False
                
        return rtn_flag
    
    def register_user(username,email,password):
        rtn_flag = False
        try:
            if type(username) != str:
                raise Exception("username parameter should be string")
            users = User_Info.objects.filter(username = username)
            if users.count() > 0:
                print("user exists")
            else:
                User_Info.objects.create(username =username, email = email, password = password)
                rtn_flag = True                
        except Exception:
            print(traceback.format_exc())
            rtn_flag = False
                
        return rtn_flag
"""        
        
class event_info(models.Model):
    #event description
    title = models.CharField(max_length=128,default = '')
    description = models.CharField(max_length=512, default = '')
    host = models.CharField(max_length=128, default = '')
    url = models.CharField(max_length=256, default = '')
    attendees = models.IntegerField(default = 0,)
    
    #date
    start_time = models.DateTimeField(default = timezone.now, null = False)
    end_time = models.DateTimeField(default = timezone.now, null = False)
    time_zone = models.CharField(max_length = 64, default = 'US/Eastern')
    
    #location
    street = models.CharField(max_length=256,default = '')
    city = models.CharField(max_length=128, default = '')
    state = models.CharField(max_length=64, default = '')
    zipcode = models.CharField(max_length=10, default = '')
    latitude = models.CharField(max_length=16, default = '')
    longitude = models.CharField(max_length=16, default = '')
    
    def __str__(self):
        return self.title + '|' + self.description + '|' + self.host + '|' + self.url
        + '|' + self.attendees + '|' + self.start_time + '|' + self.end_time + '|' + self.time_zone
        + '|' + self.street + '|' + self.city + '|' + self.state + '|' + self.zipcode + '|' + self.latitude
        + '|' + self.longitude
        #return self.title
            