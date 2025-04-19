import os
import sys


# Get the path to the project root 
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set up the Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'  # Point to the correct settings module

# Initialize Django
import django
django.setup()

from backend import settings
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import Event
from datetime import datetime

# Create your tests here.

class EventTestCase(APITestCase):
    
    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        
        # Create token for testuser
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

        # Authenticate test client
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    def test_event_creation(self):
        # Prepare the event data
        data = {
            "title": "Birthday Party",
            "description": "20th birthday for my friend John",
            "date": "2025-05-01T00:00:00Z",
            "location": "Chuck E Cheese",
            "start_time": "2025-05-01T10:00:00Z",
            "end_time": "2025-05-01T12:00:00Z",
            "latitude": 50,
            "longitude": -84.5
        }
        
        # Create event 
        response = self.client.post('/api/events/', data, format='json')

        # Assert Event created succesfully
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) 
        
        # Assert event data was captured properly
        self.assertEqual(response.data['title'], data['title'])
        self.assertEqual(response.data['description'], data['description'])
        self.assertEqual(response.data['date'], data['date'])
        self.assertEqual(response.data['location'], data['location'])
        self.assertEqual(response.data['start_time'], data['start_time'])
        self.assertEqual(response.data['end_time'], data['end_time'])
        self.assertAlmostEqual(response.data['latitude'], data['latitude'], places=3)
        self.assertAlmostEqual(response.data['longitude'], data['longitude'], places=3)

        # Assert the automatically set fields are created
        self.assertTrue('id' in response.data)
        self.assertTrue('created_at' in response.data)
        self.assertTrue('updated_at' in response.data)
        # Assert event creator == creator
        self.assertEqual(response.data['creator'], self.user.username)

        # Assert event is saved in the database
        event = Event.objects.get(id=response.data['id'])
        self.assertEqual(event.creator, self.user)

        # Delete event
        event_id = response.data['id']
        delete_response = self.client.delete(f'/api/events/{event_id}/')
        self.assertEqual(delete_response.status_code, status.HTTP_404_NOT_FOUND)

        # Try to fetch deleted event
        get_response = self.client.get(f'/api/events/{event_id}/')
        self.assertEqual(get_response.status_code, status.HTTP_404_NOT_FOUND)