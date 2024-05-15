from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .relationships_views import RelationshipViewSet, FriendRequestViewSet
from .user_views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'relationships', RelationshipViewSet)
router.register(r'friendrequests', FriendRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
