from django.http import JsonResponse
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

from django.db import connection
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q



class RelationshipViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = RelationshipSerializer

    def list(self, request, *args, **kwargs):
        raw_query = 'SELECT * FROM "MyDiscord_relationship"'
        rows = Relationship.objects.raw(raw_query)

        if rows:
            serializer = self.get_serializer(rows, many=True)
            return Response(serializer.data)
        else:
            return Response({'data': [], 'message': 'No Relationships found'}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        uID_1 = request.data.get('uID_1')
        uID_2 = request.data.get('uID_2')
        relation = request.data.get('relation')

        if not uID_1 or not uID_2 or not relation:
            return Response({'error': 'Incomplete data provided'}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            cursor.execute('''
                INSERT INTO "MyDiscord_relationship" (\"uID_1_id\", \"uID_2_id\", relation)
                VALUES (%s, %s, %s)
            ''', [uID_1, uID_2, relation])

        return Response({'message': 'Relationship created successfully'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def friends(self, request, pk=None):
        if not pk:
            return Response({'error': 'Please provide user ID'}, status=status.HTTP_400_BAD_REQUEST)

        # 获取所有朋友，当前用户是 uID_1 或 uID_2
        friends = Relationship.objects.filter(
            Q(uID_1_id=pk) | Q(uID_2_id=pk)
        ).values_list('uID_1_id', 'uID_2_id')

        # 去重并排除用户自己的 ID
        friend_ids = {uid for pair in friends for uid in pair if uid != int(pk)}

        return Response({'data': list(friend_ids), 'message': 'OK'}, status=status.HTTP_200_OK)


class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer

    def list(self, request, *args, **kwargs):
        user_id = request.query_params.get('uID')
        query = """
            SELECT * FROM "MyDiscord_friendrequest"
            WHERE \"receiver_uID_id\" = %s
        """
        if not user_id:
            friend_requests = FriendRequest.objects.raw('SELECT * FROM "MyDiscord_friendrequest"')
        else:
            friend_requests = FriendRequest.objects.raw(query, [user_id])

        serializer = self.get_serializer(friend_requests, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        sender_uID = request.data.get('sender_uID')
        receiver_uID = request.data.get('receiver_uID')

        if not sender_uID or not receiver_uID:
            return Response({'error': 'Incomplete data provided'}, status=status.HTTP_400_BAD_REQUEST)
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT COUNT(*) FROM "MyDiscord_relationship"
                WHERE ("uID_1_id" = %s AND "uID_2_id" = %s) OR ("uID_1_id" = %s AND "uID_2_id" = %s)
            ''', [sender_uID, receiver_uID, receiver_uID, sender_uID])
            result = cursor.fetchone()[0]

        if result > 0:
            return Response({'message': 'Already friends'}, status=status.HTTP_200_OK)
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT COUNT(*) FROM "MyDiscord_friendrequest"
                WHERE "sender_uID_id" = %s AND "receiver_uID_id" = %s
            ''', [sender_uID, receiver_uID])
            result = cursor.fetchone()[0]
        if result > 0:
            return Response({'message': 'Friend request already sent'}, status=status.HTTP_200_OK)

        with connection.cursor() as cursor:
            cursor.execute('''
                INSERT INTO "MyDiscord_friendrequest" (\"sender_uID_id\", \"receiver_uID_id\")
                VALUES (%s, %s)
            ''', [sender_uID, receiver_uID])

        return Response({'message': 'Friend request sent'}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def accept(self, request):
        req_id = request.data.get('req_id')

        with connection.cursor() as cursor:
            cursor.execute('SELECT \"sender_uID_id\", \"receiver_uID_id\" FROM "MyDiscord_friendrequest" WHERE id = %s', [req_id])
            row = cursor.fetchone()

        if row:
            sender_uID, receiver_uID = row
            with connection.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO "MyDiscord_relationship" (\"uID_1_id\", \"uID_2_id\", relation)
                    VALUES (%s, %s, 'friends')
                ''', [sender_uID, receiver_uID])
            with connection.cursor() as cursor:
                cursor.execute('DELETE FROM "MyDiscord_friendrequest" WHERE id = %s', [req_id])
            return Response({'message': 'Friend request accepted'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def reject(self, request, pk=None):
        req_id = request.data.get('req_id')

        with connection.cursor() as cursor:
            cursor.execute('SELECT * FROM "MyDiscord_friendrequest" WHERE id = %s', [req_id])
            row = cursor.fetchone()

        if row:
            with connection.cursor() as cursor:
                cursor.execute('DELETE FROM "MyDiscord_friendrequest" WHERE id = %s', [req_id])
            return Response({'message': 'Friend request rejected'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)


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

        if feed_type is None or feed_type_id is None:
            return Response({'error': 'feed_type and feed_type_id parameters are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT thread_id
                    FROM "MyDiscord_thread"
                    WHERE feed_type = %s AND feed_type_id = %s
                ''', [feed_type, feed_type_id])
                thread_ids = [row[0] for row in cursor.fetchall()]

                if not thread_ids:
                    return Response({'message': 'No threads found for the given feed_type and feed_type_id'}, status=status.HTTP_404_NOT_FOUND)

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

    @action(detail=False, methods=['get'], url_path='filter_message')
    def filter_message(self, request):
        keyword = request.query_params.get('keyword')
        if not keyword:
            return Response({'error': 'Keyword parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT * FROM "MyDiscord_message"
                    WHERE text_body LIKE %s
                ''', ['%' + keyword + '%'])
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
            return Response({'messages': messages_data}, status=status.HTTP_200_OK)
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

