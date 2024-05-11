from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import User
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if response.data:
            return response
        else:
            # 当没有数据时，可以自定义返回的内容
            return Response({'data': [], 'message': 'No users found'}, status=status.HTTP_200_OK)
