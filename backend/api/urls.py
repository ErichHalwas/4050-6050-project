from django.urls import path
from . import views

urlpatterns = [
    path('events/', views.EventListCreate.as_view(), name='event-list-create'),
    path('events/delete/<int:pk>/', views.EventDelete.as_view(), name='event-delete'),
]