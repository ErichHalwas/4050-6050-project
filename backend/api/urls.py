from django.urls import path
from . import views

urlpatterns = [
    path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name='note-delete'),
    path('events/', views.EventListCreate.as_view(), name='event-list-create'),
    path('events/delete/<int:pk>/', views.EventDelete.as_view(), name='event-delete'),
]