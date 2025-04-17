from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Event

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'author']
        read_only_fields = ['created_at', 'updated_at', 'author']
        extra_kwargs = {'author': {'read_only': True}}

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['author'] = request.user
        return super().create(validated_data)

class EventSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.$fZ")
    updated_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.$fZ")
    #creator = serializers.StringRelatedField()

    class Meta:
        model = Event
        fields = ['id','title','description','date','location','start_time','end_time','created_at','updated_at','creator']
        read_only_fields = ['created_at', 'updated_at', 'creator']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['creator'] = request.user
        return super().create(validated_data)
