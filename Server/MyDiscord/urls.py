from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet  # 导入视图集

router = DefaultRouter()
router.register(r'users', UserViewSet)  # 注册视图集

urlpatterns = [
    path('', include(router.urls)),
]
