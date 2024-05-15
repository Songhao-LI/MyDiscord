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


class Relationship(models.Model):
    uID_1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1_relationships')
    uID_2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2_relationships')
    relation = models.CharField(max_length=255)

    class Meta:
        unique_together = ('uID_1', 'uID_2')


class FriendRequest(models.Model):
    sender_uID = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    receiver_uID = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    status = models.CharField(max_length=255)

    class Meta:
        unique_together = ('sender_uID', 'receiver_uID')
