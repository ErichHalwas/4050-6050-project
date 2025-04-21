from rest_framework.test import APITestCase
from rest_framework import status
from api.models import Event_Info, User_Info
from django.urls import reverse


# Create your tests here.

class UserInfoViewSetTest(APITestCase):
    def setUp(self):
        self.url = reverse('user_info-list')
        self.valid_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'securepassword'
        }
        self.invalid_data = {
            'username': 'testuser',
            'email': 'invalid-email',
            'password': 'securepassword'
        }
    
    def test_create_user_valid(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User_Info.objects.count(), 1) # Check if 1 user has been created

    def test_create_user_invalid(self):
        # Attempt to create user with invalid email
        response = self.client.post(self.url, self.invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        #print(response.data)

    def test_create_user_duplicate(self):
        self.client.post(self.url, self.valid_data, format='json')

        # Attempt to create duplicate user
        response = self.client.post(self.url, self.valid_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        #print(response.data)

    def test_get_user(self):
        # Check GET and assert that the data matches
        self.client.post(self.url, self.valid_data, format='json')

        response = self.client.get(f'{self.url}{self.valid_data['username']}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        #print(response.data)
        self.assertEqual(response.data['username'], self.valid_data['username'])
        self.assertEqual(response.data['email'], self.valid_data['email'])
      
    def test_delete_user(self):
        self.client.post(self.url, self.valid_data, format='json')

        # Test if user deletion is successful
        response = self.client.delete(f'{self.url}{self.valid_data['username']}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User_Info.objects.count(), 0)

    def test_get_user_not_found(self):
        response = self.client.get(f'{self.url}IDONTEXISTUSER/', format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_user(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        #print(response.data)
        updated_data = self.valid_data.copy()
        updated_data['username'] = 'updatedUser'
        updated_data['email'] = 'updatedEmail@example.com'

        # Update user
        response = self.client.put(f'{self.url}{self.valid_data['username']}/', updated_data)
        #print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], updated_data['username'])
        self.assertEqual(response.data['email'], updated_data['email'])

    def test_update_user_invalid(self):
        self.client.post(self.url, self.valid_data, format='json')
        
        # Create data with blank username and password but a valid email
        invalid_data = {'email': '', 
                        'username': '', 
                        'password': ''
                        }
        response = self.client.put(f'{self.url}{self.valid_data['username']}/', invalid_data)
        #print(response.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['username'][0], 'This field may not be blank.')
        self.assertEqual(response.data['password'][0], 'This field may not be blank.')
        self.assertEqual(response.data['email'][0], 'This field may not be blank.')

class EventInfoViewSetTest(APITestCase):
    def setUp(self):
        self.url = reverse('event_info-list')
        self.valid_data = {
            'title': 'Birthday Gathering',
            'description': 'Get together for 21st birthday!',
            'host': 'Test Guy',
            'url': 'https://birthday.com',
            'attendees': 30,
            'start_time': '2025-04-27T8:00:00Z',
            'end_time': '2025-04-27T11:00:00Z',
            'time_zone': 'US/Eastern',
            'street': '123 Broad Street',
            'city': 'Athens',
            'state': 'GA',
            'zipcode': '30605',
            'latitude': 40,
            'longitude': -74
        }       

        self.invalid_data = {
            'title': '',
            'latitude': 120,
            'longitude': -400
        }

    def test_create_event_valid(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event_Info.objects.count(), 1)
        self.assertEqual(response.data['title'], self.valid_data['title'])

    def test_create_event_invalid(self):
        response = self.client.post(self.url, self.invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('latitude', response.data)
        self.assertIn('longitude', response.data)

    def test_get_event(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        event_id = response.data['id']
        event_url = reverse('event_info-detail', args=[event_id])
        response = self.client.get(event_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.valid_data['title'])
    
    def test_update_event(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        event_id = response.data['id']
        event_url = reverse('event_info-detail', args=[event_id])

        updated_data = {'title': 'Updated Event'}

        response = self.client.patch(event_url, updated_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], updated_data['title'])

        # verify event was updated
        event = Event_Info.objects.get(id=event_id)
        self.assertEqual(event.title, updated_data['title'])

    def test_delete_event(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        event_id = response.data['id']
        event_url = reverse('event_info-detail', args=[event_id])

        # Delete event
        response = self.client.delete(event_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Assert that attempting to get the deleted event raises the DoesNotExist error
        with self.assertRaises(Event_Info.DoesNotExist):
            Event_Info.objects.get(id=event_id)