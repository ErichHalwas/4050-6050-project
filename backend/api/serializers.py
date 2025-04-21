from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Event_Info
from .models import User_Info
import re
from django.contrib.auth.hashers import make_password

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Info
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        valid = re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value)
        if not valid:
            raise serializers.ValidationError("not a valid email")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return User_Info.objects.create(**validated_data)

class EventInfoSerializer(serializers.ModelSerializer):
    start_time = serializers.DateTimeField(format="%m/%d/%Y %I:%M:%S %p %Z", required=False)
    end_time = serializers.DateTimeField(format="%m/%d/%Y %I:%M:%S %p %Z", required=False)

    class Meta:
        model = Event_Info
        fields = ['id', 'title', 'description', 'host', 'url', 'attendees', 'start_time', 'end_time', 'time_zone', 'street', 'city', 'state', 'zipcode', 'latitude', 'longitude']
    
    def create(self, validated_data):
        event = Event_Info.objects.create(**validated_data)
        return event

    def validate_latitude(self, value):
        if value < -90 or value > 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90 degrees")
        return value
    
    def validate_longitude(self, value):
        if value < -180 or value > 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180 degrees")
        return value
    
        
#IS USERSERIALIZER USED
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
