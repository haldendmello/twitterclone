from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from django.contrib.auth import authenticate
from datetime import datetime
# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
    
# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        # create user profile
        profile = Profile(user=user)
        profile.save()
        return user

# Login Serializer
class LoginSerializer(serializers.Serializer):
  username = serializers.CharField()
  password = serializers.CharField()

  def validate(self, data):
    user = authenticate(**data)
    if user and user.is_active:
      return user
    raise serializers.ValidationError("Incorrect Credentials")


# Profile Serializer

class ProfileSerializer(serializers.ModelSerializer):
  user = serializers.CharField(source='user.username', read_only=True)
  is_following = serializers.SerializerMethodField(read_only=True)
  follower_count = serializers.SerializerMethodField(read_only=True)
  following_count = serializers.SerializerMethodField(read_only=True)
  timestamp = serializers.SerializerMethodField(read_only=True)

  class Meta:
    model = Profile
    fields = ('id', 'user', 'follower_count', 'following_count', 'is_following', 'timestamp')
 

  def get_is_following(self, obj):
    # request???
    is_following = False
    context = self.context
    request = self.context.get("request")
    if request:
      user = request.user
      is_following = user in obj.followers.all()
    return is_following
    
 
  def get_following_count(self, obj):
    return obj.following.count()
  
  def get_follower_count(self, obj):
    return obj.followers.count()

  def get_timestamp(self, obj):
    return obj.timestamp.strftime("%B %Y")


# Posts Serializer 

class PostsSerializer(serializers.ModelSerializer):

  user = serializers.CharField(source='user.username', read_only=True)
  like_count = serializers.SerializerMethodField(read_only=True)
  is_like = serializers.SerializerMethodField(read_only=True)
  timestamp = serializers.SerializerMethodField(read_only=True)

  class Meta:
    model = Posts
    fields = ('id', 'user', 'post', 'like_count', 'is_like', 'timestamp')

  def get_like_count(self, obj):
    return obj.like.count()

  def get_is_like(self, obj):
    is_like = False
    context = self.context
    request = self.context.get("request")
    if request:
      user = request.user
      is_like = user in obj.like.all()
    return is_like


  def get_timestamp(self, obj):
    now = datetime.now() 

    if obj.timestamp.strftime("%Y") != now.strftime("%Y") :
      return  obj.timestamp.strftime("%b %d, %Y")
    else:
      if obj.timestamp.strftime("%b %d") == now.strftime("%b %d") :
        return obj.timestamp.strftime("%I%p")
      else:
        return obj.timestamp.strftime("%b %d")
      


class SearchSerializer(serializers.ModelSerializer):

  user = serializers.CharField(source='user.username', read_only=True)
  is_following = serializers.SerializerMethodField(read_only=True)
  follower_count = serializers.SerializerMethodField(read_only=True)
  following_count = serializers.SerializerMethodField(read_only=True)
  timestamp = serializers.SerializerMethodField(read_only=True)

  class Meta:
    model = Profile
    fields = ('id', 'user', 'follower_count', 'following_count', 'is_following', 'timestamp')
 

  def get_is_following(self, obj):
    # request???
    is_following = False
    context = self.context
    request = self.context.get("request")
    if request:
      user = request.user
      is_following = user in obj.followers.all()
    return is_following
    
 
  def get_following_count(self, obj):
    return obj.following.count()
  
  def get_follower_count(self, obj):
    return obj.followers.count()

  def get_timestamp(self, obj):
    return obj.timestamp.strftime("%B %Y")
