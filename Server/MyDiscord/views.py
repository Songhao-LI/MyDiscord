from django.shortcuts import render
from django.contrib.auth import login
from django.contrib.auth.hashers import check_password, make_password
from django.db import connection
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

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



