from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.response import Response
from .models import User_Info, Event_Info
from .serializers import UserInfoSerializer, EventInfoSerializer

# Create your views here.


class UserInfoViewSet(viewsets.ModelViewSet):
    queryset = User_Info.objects.all()
    serializer_class = UserInfoSerializer
    
    def post(self, request):
        serializer = UserInfoSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)

class EventInfoViewSet(viewsets.ModelViewSet):
    queryset = Event_Info.objects.all()
    serializer_class = EventInfoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'creator_username']
    
    def post(self, request):
        serializer = EventInfoSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)
        

