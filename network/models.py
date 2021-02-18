from django.contrib.auth.models import User
from django.db import models


class Posts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    post = models.TextField(blank=True)
    like = models.ManyToManyField(User,blank=True, related_name="post_users")
    timestamp = models.DateTimeField(auto_now_add=True)

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="profile")
    followers = models.ManyToManyField(User,blank=True, related_name="user_followers")
    following = models.ManyToManyField(User, blank=True ,related_name="following")
    timestamp = models.DateTimeField(auto_now_add=True)

