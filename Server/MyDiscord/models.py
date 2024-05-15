from django.db import models


class User(models.Model):
    uID = models.AutoField(primary_key=True)
    block_id = models.IntegerField(null=True, blank=True)
    hood_id = models.IntegerField(null=True, blank=True)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    profile = models.TextField()
    photo = models.CharField(max_length=100)
    home_longitude = models.FloatField(null=True, blank=True)
    home_latitude = models.FloatField(null=True, blank=True)
    last_login = models.DateTimeField(auto_now_add=True)  # auto_now_add=True Isn't Working with Raw SQL
