from . import apps
from . import views
from django.urls import path
from django.urls import include


urlpatterns = [
    path('user', views.user_view, name='user'),
]
