from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Relationship, FriendRequest, User
from .serializers import RelationshipSerializer, FriendRequestSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Thread, Message, User
from .serializers import ThreadSerializer, MessageSerializer
import logging

from django.db import connection, transaction
from django.utils import timezone
from rest_framework.viewsets import ReadOnlyModelViewSet
import uuid
from django.utils import timezone


class RelationshipViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = RelationshipSerializer

    @action(detail=True, methods=['post'])
    def add_relationship(self, request, pk=None):
        # 添加逻辑来创建新的关系
        pass


class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer

    @action(detail=True, methods=['post'])
    def send_request(self, request, pk=None):
        # 添加逻辑来发送好友请求
        pass

    @action(detail=True, methods=['post'])
    def accept_request(self, request, pk=None):
        # 添加逻辑来接受好友请求
        pass

    @action(detail=True, methods=['post'])
    def reject_request(self, request, pk=None):
        # 添加逻辑来拒绝好友请求
        pass


class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    @action(detail=False, methods=['post'])
    def create_thread(self, request):
        title = request.data.get('title')
        timestamp = timezone.now()
        text_body = request.data.get('text_body')
        longitude = request.data.get('longitude')
        latitude = request.data.get('latitude')
        author_id = request.data.get('author_id')
        feed_type = request.data.get('feed_type')
        feed_type_id = request.data.get('feed_type_id')

        with connection.cursor() as cursor:
            # 插入一个新的线程，initial_message_id 设置为 0
            cursor.execute('''
                INSERT INTO "MyDiscord_thread" (initial_message_id, feed_type, feed_type_id)
                VALUES (0, %s, %s)
                RETURNING thread_id
            ''', [feed_type, feed_type_id])
            thread_id = cursor.fetchone()[0]
            print(f"New thread_id: {thread_id}")

        with connection.cursor() as cursor:
            cursor.execute('''
                INSERT INTO "MyDiscord_message" (title, timestamp, text_body, longitude, latitude, author_id_id, thread_id)
                VALUES (%s,%s,%s,%s,%s,%s,%s)
                RETURNING message_id
            ''', [title, timestamp, text_body, longitude, latitude, author_id, thread_id])
            message_id = cursor.fetchone()[0]
            print(message_id)

        with connection.cursor() as cursor:
            # 更新线程的初始消息ID
            cursor.execute('''
                UPDATE "MyDiscord_thread"
                SET initial_message_id = %s
                WHERE thread_id = %s
            ''', [message_id, thread_id])

        # TODO: insert into recipient

        return Response({'message_id': message_id, 'thread_id': thread_id}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='get_message_by_thread')
    def get_message_by_thread(self, request):
        feed_type = request.query_params.get('feed_type')
        feed_type_id = request.query_params.get('feed_type_id')

        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT thread_id
                    FROM "MyDiscord_thread"
                    WHERE feed_type = %s AND feed_type_id = %s
                ''', [feed_type, feed_type_id])
                thread_ids = [row[0] for row in cursor.fetchall()]

                cursor.execute('''
                    SELECT * FROM "MyDiscord_message"
                    WHERE thread_id IN %s
                ''', [tuple(thread_ids)])
                messages = cursor.fetchall()

            messages_data = []
            for message in messages:
                message_data = {
                    'message_id': message[0],
                    'title': message[1],
                    'timestamp': message[2],
                    'text_body': message[3],
                    'longitude': message[4],
                    'latitude': message[5],
                    'author_id': message[6],
                    'thread_id': message[7]
                }
                messages_data.append(message_data)

            return Response({'thread_ids': thread_ids, 'messages': messages_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def reply(self, request):
        thread_id = request.data.get('thread_id')
        title = request.data.get('title')
        timestamp = timezone.now()
        text_body = request.data.get('text_body')
        longitude = request.data.get('longitude')
        latitude = request.data.get('latitude')
        author_id = request.data.get('author_id')

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute('''
                        SELECT initial_message_id
                        FROM "MyDiscord_thread"
                        WHERE thread_id = %s
                    ''', [thread_id])
                    initial_message_id = cursor.fetchone()[0]
                    print(f"Initial message ID: {initial_message_id}")

                    cursor.execute('''
                        INSERT INTO "MyDiscord_message" (title, timestamp, text_body, longitude, latitude, author_id_id, thread_id)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        RETURNING message_id
                    ''', [title, timestamp, text_body, longitude, latitude, author_id, thread_id])
                    message_id = cursor.fetchone()[0]
                    print(f"New message ID: {message_id}")

            return Response(
                {'given thread_id': thread_id, 'message_id': message_id, 'initial_message_id': initial_message_id},
                status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
