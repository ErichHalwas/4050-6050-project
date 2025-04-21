from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserInfoViewSet, EventInfoViewSet, TokenViewSet

router = DefaultRouter()
router.register(r'userinfo', UserInfoViewSet)
router.register(r'eventinfo', EventInfoViewSet)
router.register(r'token', TokenViewSet, basename='token')

urlpatterns = [
    path('', include(router.urls)),
]