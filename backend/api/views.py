from django.shortcuts import render
from rest_framework import viewsets,generics
from .models import User_Info
from .serializers import UserInfoSerializer

# Create your views here.


class UserInfoViewSet(viewsets.ModelViewSet):
    queryset = User_Info.objects.all()
    serializer_class = UserInfoSerializer