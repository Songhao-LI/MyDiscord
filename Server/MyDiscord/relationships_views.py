from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Relationship, FriendRequest, User
from .serializers import RelationshipSerializer, FriendRequestSerializer


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
