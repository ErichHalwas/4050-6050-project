from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, EventSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class EventListCreate(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        #return Event.objects.filter(creator=self.request.user) # only returns events created by current user
        queryset = Event.objects.all()
        
        creator_username = self.request.query_params.get('creator', None)
        print("Debugging: Creator Username:", creator_username)

        # Search by creator function
        if creator_username:
            users = User.objects.filter(username__icontains=creator_username)
            if users.exists():
                for user in users:
                    print(f"Debugging: Creator User: {user.username} // ID: {user.id}")
                queryset = queryset.filter(creator__in=users)
            else:
                queryset = queryset.none()
                print(f"No users found with username {creator_username}")
              
        # Search function
        search_term = self.request.query_params.get('search', None)
        if search_term:
            queryset = queryset.filter(title__icontains=search_term) 
        
        return queryset

    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class EventDelete(generics.DestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(f"Authenticated user: {self.request.user}")
        return Event.objects.filter(creator=self.request.user)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        return Response({"id": request.user.id,
                         "username": request.user.username, 
                         "email": request.user.email,
                         })
    