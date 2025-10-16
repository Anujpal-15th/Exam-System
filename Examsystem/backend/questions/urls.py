from django.urls import path
from . import views
urlpatterns = [
    path('questions/', views.QuestionList, name='question-list'),
    path('questions/<int:pk>/', views.QuestionDetail, name='question-detail'),
    path('teacher/dashboard/', views.teacher_dashboard, name='teacher-dashboard'),
    path('admin/dashboard/', views.admin_dashboard, name='admin-dashboard'),
    path('student/dashboard/', views.student_dashboard, name='student-dashboard'),
    path('test/dashboard/', views.test_interface, name='test-interface'),
]  