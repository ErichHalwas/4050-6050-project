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

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)

class EventInfoSerializer(serializers.ModelSerializer):
    start_time = serializers.DateTimeField(
        format="%m/%d/%Y %I:%M:%S %p %Z",
        required=False
    )
    end_time = serializers.DateTimeField(
        format="%m/%d/%Y %I:%M:%S %p %Z",
        required=False
    )
    attendees = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='username'
    )
    saved_by = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='username'
    )

    class Meta:
        model = Event_Info
        fields = [
            'id', 'title', 'description', 'host', 'url',
            'attendees', 'start_time', 'end_time', 'time_zone',
            'street', 'city', 'state', 'zipcode',
            'latitude', 'longitude', 'image_url', 'saved_by'
        ]
        extra_kwargs = {
            'host': {'required': False},
            'attendees': {'required': False},
            'saved_by': {'required': False},
        }

    def create(self, validated_data):
        # Remove M2M fields first
        attendees = validated_data.pop('attendees', [])
        saved_by = validated_data.pop('saved_by', [])

        # Create the event
        event = Event_Info.objects.create(**validated_data)

        # Assign M2M fields after creation
        event.attendees.set(attendees)
        event.saved_by.set(saved_by)

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
    
