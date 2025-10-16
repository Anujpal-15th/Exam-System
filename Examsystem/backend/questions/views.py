from django.shortcuts import render
from .models import Question
from django.contrib.auth.decorators import login_required

def home(request):
    questions = Question.objects.all().order_by('-created_at')
    return render(request, 'templates/index.html', {'questions': questions})

def QuestionList(request):
    questions = Question.objects.all()
    return render(request, 'questions/question_list.html', {'questions': questions})

def QuestionDetail(request, pk):
    question = Question.objects.get(pk=pk)
    return render(request, 'questions/question_detail.html', {'question': question})

@login_required
def teacher_dashboard(request):
    return render(request, 'questions/teacher_dashboard.html')

@login_required
def admin_dashboard(request):
    return render(request, 'questions/admin_dashboard.html')

@login_required
def student_dashboard(request):
    return render(request, 'questions/student_dashboard.html')

@login_required
def test_dashboard(request):
    return render(request, 'questions/test_dashboard.html')