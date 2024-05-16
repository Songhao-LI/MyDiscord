from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Message, Thread

class MessageTests(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_create_message_without_thread_id(self):
        author_id = 1  # 假设这个用户的 ID 是 1
        # 如果你有 User 模型，确保用户存在
        # User.objects.create(id=author_id, username='testuser')

        data = {
            'title': 'Test Message',
            'timestamp': '2024-05-15T12:34:56Z',
            'text_body': 'This is a test message',
            'longitude': 40.7128,
            'latitude': 74.0060,
            'author_id': author_id,
        }

        response = self.client.post('/api/messages/create_message/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message_id', response.data)
        self.assertIn('thread_id', response.data)

        message = Message.objects.get(id=response.data['message_id'])
        self.assertEqual(message.title, 'Test Message')
        self.assertEqual(message.author_id, author_id)
        self.assertEqual(message.thread_id, response.data['thread_id'])

        thread = Thread.objects.get(id=response.data['thread_id'])
        self.assertEqual(thread.initial_message_id, message.id)