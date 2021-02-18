from django.urls import path
from knox import views as knox_views
from . import views

urlpatterns = [
    # user registration
    path('register', views.RegisterAPI.as_view(), name='register'),
    path('login', views.LoginAPI.as_view(), name='login'),
    path('logout', knox_views.LogoutView.as_view(), name='logout'),
    path('logoutall', knox_views.LogoutAllView.as_view(), name='logoutall'),
    path('user', views.UserAPI.as_view(), name="user"),
    

    # api
    path('post-create', views.PostsCreate),  # create post
    path('posts-all', views.PostsView), # view all posts
    path('posts/<str:user>',views.PostsUser), # posts of user
    path('profile/<str:user>',views.ProfileUser), # user profile 
    path('following', views.PostsFollowing), # following 
    path('post-update/<str:pk>', views.PostUpdate), # posts update
    path('post-like/<str:pk>', views.PostLike), # posts like 
    path('post-dislike/<str:pk>', views.PostdisLike), # posts dislike
    path('profile-follow/<str:pk>', views.ProfileFollow), # profile follow
    path('profile-unfollow/<str:pk>', views.ProfileUnfollow), # profile unfollow
    path('post-delete/<str:pk>', views.PostDelete), # post delete`
]

