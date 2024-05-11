from django.db import models


class User(models.Model):
    uID = models.AutoField(primary_key=True)
    block_id = models.IntegerField(null=True, blank=True)
    hood_id = models.IntegerField(null=True, blank=True)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    profile = models.TextField()
    photo = models.CharField(max_length=100)
    home_longitude = models.FloatField()
    home_latitude = models.FloatField()
    last_access = models.DateTimeField(auto_now_add=True)
