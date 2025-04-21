from rest_framework.test import APITestCase
from rest_framework import status
from api.models import Event_Info, User_Info
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

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

    def login(self):
        self.client.post(self.url, self.valid_data, format='json')
        login_url = reverse('token-login')
        response = self.client.post(login_url, self.valid_data, format='json')
        self.client.cookies.update(response.cookies)

    def test_create_user_valid(self):
        response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User_Info.objects.count(), 1)

    def test_create_user_invalid(self):
        response = self.client.post(self.url, self.invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_create_user_duplicate(self):
        self.client.post(self.url, self.valid_data, format='json')
        response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_get_user(self):
        self.login()
        response = self.client.get(f'{self.url}{self.valid_data["username"]}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.valid_data['username'])
        self.assertEqual(response.data['email'], self.valid_data['email'])

    def test_delete_user(self):
        self.login()
        response = self.client.delete(f'{self.url}{self.valid_data["username"]}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User_Info.objects.count(), 0)

    def test_unauthenticated_delete_user(self):
        self.client.post(self.url, self.valid_data, format='json')
        response = self.client.delete(f'{self.url}{self.valid_data["username"]}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_not_found(self):
        self.login()
        response = self.client.get(f'{self.url}IDONTEXISTUSER/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_user(self):
        self.login()
        updated_data = self.valid_data.copy()
        updated_data['username'] = 'updatedUser'
        updated_data['email'] = 'updatedEmail@example.com'
        response = self.client.put(f'{self.url}{self.valid_data["username"]}/', updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], updated_data['username'])
        self.assertEqual(response.data['email'], updated_data['email'])

    def test_update_user_invalid(self):
        self.login()
        invalid_data = {'email': '', 'username': '', 'password': ''}
        response = self.client.put(f'{self.url}{self.valid_data["username"]}/', invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['username'][0], 'This field may not be blank.')
        self.assertEqual(response.data['password'][0], 'This field may not be blank.')
        self.assertEqual(response.data['email'][0], 'This field may not be blank.')

    def test_user_login_and_refresh(self):
        self.client.post(self.url, self.valid_data, format='json')
        login_url = reverse('token-login')
        response = self.client.post(login_url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.cookies)
        self.assertIn('refresh', response.cookies)

        refresh_url = reverse('token-refresh')
        response = self.client.post(refresh_url, format='json', cookies={
            'refresh': response.cookies['refresh'].value
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.cookies)

    def test_user_logout(self):
        self.client.post(self.url, self.valid_data, format='json')
        login_url = reverse('token-login')
        login_response = self.client.post(login_url, self.valid_data, format='json')
        logout_url = reverse('token-logout')
        response = self.client.post(logout_url, format='json', cookies={
            'access': login_response.cookies['access'].value,
            'refresh': login_response.cookies['refresh'].value
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.cookies.get('access', '').value, '')
        self.assertEqual(response.cookies.get('refresh', '').value, '')


class EventInfoViewSetTest(APITestCase):
    def setUp(self):
        self.url = reverse('event_info-list')
        self.user_data = {
            'username': 'hostuser',
            'email': 'hostuser@example.com',
            'password': 'securepassword'
        }
        self.valid_data = {
            'title': 'Birthday Gathering',
            'description': 'Get together for 21st birthday!',
            'host': 'hostuser',
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
        self.client.post(reverse('user_info-list'), self.user_data, format='json')
        login_url = reverse('token-login')
        login_response = self.client.post(login_url, self.user_data, format='json')
        self.client.cookies.update(login_response.cookies)
        access_token = login_response.cookies['access'].value
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

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
        post_response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        event_id = post_response.data.get('id')
        self.assertIsNotNone(event_id)
        event_url = reverse('event_info-detail', args=[event_id])
        response = self.client.get(event_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.valid_data['title'])

    def test_update_event(self):
        post_response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        event_id = post_response.data.get('id')
        self.assertIsNotNone(event_id)
        event_url = reverse('event_info-detail', args=[event_id])
        updated_data = {'title': 'Updated Event'}
        response = self.client.patch(event_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], updated_data['title'])
        event = Event_Info.objects.get(id=event_id)
        self.assertEqual(event.title, updated_data['title'])

    def test_delete_event(self):
        post_response = self.client.post(self.url, self.valid_data, format='json')
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)
        event_id = post_response.data.get('id')
        self.assertIsNotNone(event_id)
        event_url = reverse('event_info-detail', args=[event_id])
        response = self.client.delete(event_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Event_Info.DoesNotExist):
            Event_Info.objects.get(id=event_id)

class EventDeletePermissionTest(APITestCase):
    def setUp(self):
        self.user = User_Info.objects.create(username='firstUser', email='firstuser@example.com', password='firstUserpassword')
        self.event = Event_Info.objects.create(
            title='Delete Test Event',
            description='Will it get deleted?',
            host='Bob',
            latitude=40.0,
            longitude=-74.0,
            start_time='2025-05-01T10:00:00Z',
            end_time='2025-05-01T12:00:00Z',
            time_zone='UTC',
            street='123 Lane',
            city='Testville',
            state='TS',
            zipcode='00000',
            url='http://event.com'
        )
        self.url = reverse('event_info-detail', kwargs={'pk': self.event.id})

    def test_unauthenticated_user_delete(self):
        print(self.event)
        response = self.client.delete(self.url)
        print("Delete response Status:", response.status_code)
        self.assertTrue(Event_Info.objects.filter(id=self.event.id).exists())
            