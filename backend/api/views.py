from math import cos, radians
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
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import requests
from django.conf import settings
from django.db.models import Q

class TokenViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = User_Info.objects.get(username=username)
        except User_Info.DoesNotExist:
            user = None

        if not user or not check_password(password, user.password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        class FakeUser:
            def __init__(self, id): self.id = id

        fake_user = FakeUser(user.pk)
        refresh = RefreshToken.for_user(fake_user)
        access_token = str(refresh.access_token)

        response = Response({
            'message': 'Logged in',
            'username': user.username,
            'email': user.email,
            'pfp_url': request.build_absolute_uri(user.pfp_url.url) if user.pfp_url else None
        })
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

    parser_classes = [JSONParser, MultiPartParser, FormParser]
    lookup_field = 'username'

    
    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve', 'hosted', 'attending', 'saved']:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['get'])
    def hosted(self, request, username=None):
        user = self.get_object()
        events = user.events_hosted.all()
        serializer = EventInfoSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def attending(self, request, username=None):
        user = self.get_object()
        events = user.events_attending.all()
        serializer = EventInfoSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def saved(self, request, username=None):
        user = self.get_object()
        events = user.saved_events.all()
        serializer = EventInfoSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'pfp_url': request.build_absolute_uri(user.pfp_url.url) if user.pfp_url else None,
        })


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

    @action(detail=True, methods=['post'], url_path='upload-pfp')
    def upload_pfp(self, request, pk=None):
        instance = self.get_object()
        if request.user.username != instance.username:
            raise PermissionDenied("You can only upload your own profile picture.")
        file = request.FILES.get('pfp')
        if not file:
            return Response({'error': 'No file uploaded'}, status=400)
        instance.pfp_url = file
        instance.save()
        return Response({
            'message': 'Profile picture uploaded',
            'pfp_url': request.build_absolute_uri(instance.pfp_url.url)
        })

class EventInfoViewSet(viewsets.ModelViewSet):
    queryset = Event_Info.objects.all()
    serializer_class = EventInfoSerializer
    permission_classes = [IsAuthenticated]


    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'nearby_events']:
            return [AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=["get"], url_path="search", permission_classes=[AllowAny])
    def search(self, request):
        query = request.query_params.get("q", "")
        if not query:
            return Response([])

        events = Event_Info.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(city__icontains=query) |
            Q(state__icontains=query)
        )

        serializer = self.get_serializer(events, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='nearby')
    def nearby_events(self, request):
        try:
            lat = float(request.query_params.get('lat'))
            lon = float(request.query_params.get('lon'))
        except (TypeError, ValueError):
            return Response({"error": "lat and lon query parameters are required"}, status=400)

        # ~1 degree of lat ≈ 69 miles, 1 degree of lon ≈ 69 * cos(latitude)
        mile_offset = 20
        lat_range = mile_offset / 69.0
        lon_range = mile_offset / (69.0 * cos(radians(lat)))

        events = Event_Info.objects.filter(
            latitude__gte=lat - lat_range,
            latitude__lte=lat + lat_range,
            longitude__gte=lon - lon_range,
            longitude__lte=lon + lon_range,
        )

        serializer = self.get_serializer(events, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def save_event(self, request, pk=None):
        event = self.get_object()
        user = request.user
        event.saved_by.add(user)
        return Response({'message': 'Event saved'})

    @action(detail=True, methods=['post'])
    def unsave_event(self, request, pk=None):
        event = self.get_object()
        user = request.user
        event.saved_by.remove(user)
        return Response({'message': 'Event unsaved'})

    @action(detail=True, methods=['post'])
    def attend(self, request, pk=None):
        event = self.get_object()
        user = request.user
        event.attendees.add(user)
        return Response({'message': 'Marked as attending'})

    @action(detail=True, methods=['post'])
    def unattend(self, request, pk=None):
        event = self.get_object()
        user = request.user
        event.attendees.remove(user)
        return Response({'message': 'Unmarked as attending'})

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user or not request.user.is_authenticated:
            raise NotAuthenticated("You must be logged in to update events.")
        if request.user.username != instance.host.username:
            raise PermissionDenied("You can only update your own events.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user or not request.user.is_authenticated:
            raise NotAuthenticated("You must be logged in to delete events.")
        if request.user.username != instance.host.username:
            raise PermissionDenied("You can only delete your own events.")
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        if not self.request.user or not self.request.user.is_authenticated:
            raise NotAuthenticated("You must be logged in to create events.")

        event = serializer.save(host=self.request.user)

        # Geocode the address
        full_address = f"{event.street}, {event.city}, {event.state}, {event.zipcode}"
        api_key = settings.OPENCAGE_API_KEY
        url = f"https://api.opencagedata.com/geocode/v1/json?q={full_address}&key={api_key}"

        try:
            res = requests.get(url)
            res.raise_for_status()
            data = res.json()

            if data["results"]:
                coords = data["results"][0]["geometry"]
                event.latitude = coords["lat"]
                event.longitude = coords["lng"]
                event.save()
        except Exception as e:
            print("Geocoding failed:", e)
    
    parser_classes = [MultiPartParser, FormParser]
    @action(detail=True, methods=['post'], url_path='upload-image')
    def upload_image(self, request, pk=None):
        instance = self.get_object()
        if request.user.username != instance.host:
            raise PermissionDenied("You can only upload images for your own events.")
        file = request.FILES.get('image')
        if not file:
            return Response({'error': 'No file uploaded'}, status=400)
        instance.image_url = file
        instance.save()
        return Response({'message': 'Event image uploaded', 'image_url': instance.image_url.url})