from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserInfoViewSet, EventInfoViewSet


router = DefaultRouter()
router.register(r'userinfo', UserInfoViewSet)
router.register(r'eventinfo', EventInfoViewSet)
urlpatterns = [
    path('', include(router.urls)),

]