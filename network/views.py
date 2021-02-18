from django.shortcuts import render
from django.http import HttpResponse

# rest_framework permission class
from rest_framework.decorators import api_view,parser_classes
from rest_framework.permissions import IsAuthenticated

# register user 
from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer


# login and logout 
from django.contrib.auth import login

from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView

# API for Profile and Posts
# from rest_framework.permissions import IsAuthenticated
from rest_framework.fields import CurrentUserDefault
from rest_framework import generics
from .serializers import ProfileSerializer, PostsSerializer, SearchSerializer
from .models import *
from rest_framework.decorators import api_view
from rest_framework.response import Response  
from rest_framework.pagination import PageNumberPagination

# serach filter import 
from rest_framework import filters

from django_filters.rest_framework import DjangoFilterBackend

# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
        "user": UserSerializer(user, context=self.get_serializer_context()).data,
        "token": AuthToken.objects.create(user)[1]
        })

# loogin api
class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)



# Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ] 
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


# post create 
@api_view(['POST'])
def PostsCreate(request):
    serializer = PostsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
    return Response(serializer.data)

# post update
@api_view(['POST'])
def PostUpdate(request,pk):
    if request.user:
        post = Posts.objects.get(pk = pk)
        serializer = PostsSerializer( instance=post , data=request.data)
        if serializer.is_valid():
            serializer.save()
        return  Response(serializer.data)

# post delete
@api_view(['POST'])
def PostDelete(request, pk):
    if request.user:

        post = Posts.objects.get(pk = pk)
        if request.user == post.user :
            post.delete()
            return Response("Post Deleted.")
        else:
            return Response("Not Logged In.")
    else:
        return Response("Not Logged In.")

# post view all
@api_view(['GET'])
def PostsView(request, *args, **kwargs):
    paginator = PageNumberPagination()
    paginator.page_size = 10
    queryset = Posts.objects.all().order_by("-timestamp").all()
    paginated_qs = paginator.paginate_queryset(queryset, request)
    serializer = PostsSerializer(instance = paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data) 
    

#  posts views of user logedin following
@api_view(['GET'])
def PostsFollowing(request, *args, **kwargs):
    paginator = PageNumberPagination()
    paginator.page_size = 10
    user = User.objects.get(id = request.user.id)

    pro_user = Profile.objects.filter(user=user)

    followed_users = []

    for follow in pro_user:
        followed_users += follow.following.all()

    queryset = Posts.objects.filter(user__in=followed_users).order_by("-timestamp")
    paginated_qs = paginator.paginate_queryset(queryset, request)
    
    serializer = PostsSerializer(instance = paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data) 


# post of user for profile page 
@api_view(['GET'])
def PostsUser(request, user, *args, **kwargs):
    paginator = PageNumberPagination()
    paginator.page_size = 10
    user = User.objects.get(username=user)
    queryset = user.posts.order_by("-timestamp").all()
    paginated_qs = paginator.paginate_queryset(queryset, request)

    serializer = PostsSerializer(instance = paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data) 



# view profie page of users
@api_view(['GET'])
def ProfileUser(request, user):
    pro_user = User.objects.get(username=user)
    queryset = Profile.objects.filter(user=pro_user)
    serializer = ProfileSerializer(instance= queryset, many=True, context={"request": request})
    return Response( serializer.data, status= 200)  

# post like button
@api_view(['PUT'])
def PostLike(request, pk):
    post = Posts.objects.get(pk = pk)
    post.like.add(request.user)
    return Response("post liked")

# post dis like
@api_view(['PUT'])
def PostdisLike(request, pk):
    post = Posts.objects.get(pk = pk)
    post.like.remove(request.user)
    return Response("post disliked")

# profile follow
@api_view(['POST'])
def ProfileFollow(request, pk): 

    profile = Profile.objects.get(pk = pk)
    profileuser = Profile.objects.get(user=request.user)
    profile.followers.add(request.user)
    profileuser.following.add(profile.user)
    return Response("followed") 

#  profile unfollow
@api_view(['POST'])
def ProfileUnfollow(request, pk):
    profile = Profile.objects.get(pk = pk)
    profileuser = Profile.objects.get(user=request.user)
    profile.followers.remove(request.user)
    profileuser.following.remove(profile.user)
    return Response("unfollowed")

