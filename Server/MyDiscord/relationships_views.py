from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Relationship, FriendRequest, User
from .serializers import RelationshipSerializer, FriendRequestSerializer
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

