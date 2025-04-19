from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserInfoViewSet


router = DefaultRouter()
router.register(r'userinfo', UserInfoViewSet)
urlpatterns = [
    path('', include(router.urls)),
]