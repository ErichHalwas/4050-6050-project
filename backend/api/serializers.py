from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Event_Info
from .models import User_Info
import re

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Info
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}} #does not return password column, but can POST all columns
    
    def validate_email(self, value):
        valid = re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value)
        if not valid:
            raise serializers.ValidationError("not a valid email")
        return value

    def create(self, validated_data):
        user = User_Info.objects.create(**validated_data)
        return user

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
    
"""
class EventSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", required=False)
    updated_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", required=False)

    def validate_latitude(self, value):
        if value < -90 or value > 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90 degrees")
        return value

    def validate_longitude(self, value):
        if value < -180 or value > 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180 degrees")
        return value

    class Meta:
        model = Event
        fields = ['id','title','description','date','location','longitude','latitude','start_time','end_time','created_at','updated_at','creator']
        read_only_fields = ['id', 'created_at', 'updated_at', 'creator']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['creator'] = request.user
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Convert creator to username string in the response
        representation['creator'] = instance.creator.username
        return representation
"""