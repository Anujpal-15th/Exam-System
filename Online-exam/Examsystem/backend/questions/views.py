from django.shortcuts import render
from .models import Question
# Create your views here.

def home(request):
    questions = Question.objects.all().order_by('-created_at')
    return render(request, 'templates/index.html', {'questions': questions})