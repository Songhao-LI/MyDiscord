from django.shortcuts import render
from django.contrib.auth import login
from django.contrib.auth.hashers import check_password, make_password
from django.db import connection
from django.utils.dateparse import parse_datetime
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

from rest_framework import permissions
from .models import Thread, Message
from .serializers import MessageSerializer, ThreadSerializer

current_user = None


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        raw_query = 'SELECT * FROM "MyDiscord_user"'
        rows = User.objects.raw(raw_query)

        if rows:
            serializer = self.get_serializer(rows, many=True)
            return Response(serializer.data)
        else:
            return Response({'data': [], 'message': 'No users found'}, status=status.HTTP_200_OK)

    # register
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # SQL to insert a new user
            with connection.cursor() as cursor:
                cursor.execute('''
                INSERT INTO "MyDiscord_user" (username, password, block_id, hood_id, profile, photo, home_longitude, home_latitude, last_login)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', [
                    serializer.validated_data['username'],
                    make_password(serializer.validated_data['password']),
                    serializer.validated_data.get('block_id', None),
                    serializer.validated_data.get('hood_id', None),
                    serializer.validated_data['profile'],
                    serializer.validated_data['photo'],
                    serializer.validated_data.get('home_longitude', None),
                    serializer.validated_data.get('home_latitude', None),
                    timezone.now()  # Manually setting the current timestamp
                ])
                return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        global current_user
        username = request.data.get('username')
        password = request.data.get('password')

        with connection.cursor() as cursor:
            cursor.execute("SELECT \"uID\", password FROM \"MyDiscord_user\" WHERE username = %s", [username])
            user = cursor.fetchone()

        if user:
            user_id, hashed_password = user
            if check_password(password, hashed_password):
                # TODO: token, created = Token.objects.get_or_create(user=current_user)
                with connection.cursor() as cursor:
                    cursor.execute("UPDATE \"MyDiscord_user\" SET last_login = %s WHERE \"uID\" = %s",
                                   [timezone.now(), user_id])

                current_user = User.objects.get(pk=user_id)
                login(request, current_user)  # This handles the session
                serializer = self.get_serializer(current_user)
                return Response({
                    'message': 'Login successful',
                    'user': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"error": "Invalid username"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        global current_user
        current_user = None
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

    # TODO: permission_classes=[IsAuthenticated]
    @action(detail=False, methods=['get'])
    def current(self, request):
        global current_user
        if current_user:
            serializer = self.get_serializer(current_user)
            return Response(serializer.data)
        else:
            return Response({"error": "No user logged in"}, status=status.HTTP_404_NOT_FOUND)

    # partial update
    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        user_data = request.data
        allowed_fields = {'block_id', 'hood_id', 'profile', 'photo', 'home_longitude', 'home_latitude'}
        fields_to_update = {k: v for k, v in user_data.items() if k in allowed_fields}

        if not fields_to_update:
            return Response({"error": "No valid field provided for update"}, status=status.HTTP_400_BAD_REQUEST)

        set_clauses = []
        params = []
        for field, value in fields_to_update.items():
            # if field == 'last_login' and isinstance(value, str):
            #     value = parse_datetime(value)
            if field == 'password':
                value = make_password(value)
            set_clauses.append(f"{field} = %s")
            params.append(value)

        params.append(pk)
        sql_update_query = f'''
            UPDATE "MyDiscord_user"
            SET {', '.join(set_clauses)}
            WHERE "uID" = %s
        '''

        with connection.cursor() as cursor:
            cursor.execute(sql_update_query, params)
            if cursor.rowcount == 0:
                return Response({"error": "No such user or no update performed"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "User updated successfully"}, status=status.HTTP_200_OK)



