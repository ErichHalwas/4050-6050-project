from django.shortcuts import render
from rest_framework import viewsets
from .models import User_Info
from .serializers import UserInfoSerializer

class UserInfoViewSet(viewsets.ModelViewSet):
    queryset = User_Info.objects.all()
    serializer_class = UserInfoSerializer
# Create your views here.
