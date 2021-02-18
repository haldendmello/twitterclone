from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('following',views.index, name='index'),
    path('profile/<str:username>',views.index, name='index'),
    path('login', views.index, name='index'),
    path('signup', views.index, name='index'),
    


]