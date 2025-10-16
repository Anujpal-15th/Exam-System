from django.urls import path
from . import views
urlpatterns = [
    path('questions/', views.QuestionList, name='question-list'),
    path('questions/<int:pk>/', views.QuestionDetail, name='question-detail'),
]  