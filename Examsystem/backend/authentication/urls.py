# backend/authentication/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_page, name='login'),
    path('login/', views.login_user, name='login_user'),
    path('logout/', views.logout, name='logout_user'),
]