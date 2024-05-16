from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .user_views  import UserViewSet  # 导入视图集
from .relationships_views import ThreadViewSet, MessageViewSet

from .relationships_views import RelationshipViewSet, FriendRequestViewSet
from .user_views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)  # 注册视图集
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'threads', ThreadViewSet, basename='thread')
router.register(r'relationships', RelationshipViewSet)
router.register(r'friendrequests', FriendRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
