from tokenize import TokenError
from django.shortcuts import render
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from .models import User_Info, Event_Info
from .serializers import UserInfoSerializer, EventInfoSerializer
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from rest_framework.exceptions import PermissionDenied, NotAuthenticated

class TokenViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = User_Info.objects.get(username=username)
        except User_Info.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if not check_password(password, user.password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        class FakeUser:
            def __init__(self, id): self.id = id

        fake_user = FakeUser(user.pk)
        refresh = RefreshToken.for_user(fake_user)
        access_token = str(refresh.access_token)

        response = Response({'message': 'Logged in'})
        response.set_cookie('access', access_token, httponly=True, secure=False, max_age=300)
        response.set_cookie('refresh', str(refresh), httponly=True, secure=False, max_age=3600*24)
        return response

    @action(detail=False, methods=['post'])
    def refresh(self, request):
        refresh_token = request.COOKIES.get('refresh')
        if not refresh_token:
            return Response({'error': 'No refresh token found in cookies'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response({'message': 'Token refreshed'})
            response.set_cookie('access', access_token, httponly=True, secure=False, max_age=300)
            return response
        except Exception as e:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        response = Response({'message': 'Logged out'})
        response.delete_cookie('access', path='/')
        response.delete_cookie('refresh', path='/')
        return response

class UserInfoViewSet(viewsets.ModelViewSet):
    queryset = User_Info.objects.all()
    serializer_class = UserInfoSerializer

    def get_permissions(self):
        if self.action in ['create', 'list']:  # Anyone can register or view all
            return [AllowAny()]
        return [IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user or not request.user.is_authenticated:
            raise NotAuthenticated("You must be logged in to update your account.")
        if request.user.username != instance.username:
            raise PermissionDenied("You can only update your own account.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user or not request.user.is_authenticated:
            raise NotAuthenticated("You must be logged in to delete your account.")
        if request.user.username != instance.username:
            raise PermissionDenied("You can only delete your own account.")
        return super().destroy(request, *args, **kwargs)

    def post(self, request):
        serializer = UserInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

class EventInfoViewSet(viewsets.ModelViewSet):
    queryset = Event_Info.objects.all()
    serializer_class = EventInfoSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user or not request.user.is_authenticated:
            raise NotAuthenticated("You must be logged in to update events.")
        if request.user.username != instance.host:
            raise PermissionDenied("You can only update your own events.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user or not request.user.is_authenticated:
            raise NotAuthenticated("You must be logged in to delete events.")
        if request.user.username != instance.host:
            raise PermissionDenied("You can only delete your own events.")
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        if not self.request.user or not self.request.user.is_authenticated:
            raise NotAuthenticated("You must be logged in to create events.")
        serializer.save(host=self.request.user.username)