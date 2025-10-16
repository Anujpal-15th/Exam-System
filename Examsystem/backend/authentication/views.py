from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.contrib import messages

# Create your views here.
def login_page(request):
    return render(request, 'login.html')

def logout(request):
    return render(request, 'logged_out.html')

def login_user(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            if user.is_superuser:
                return redirect('/admin-dashboard/')
            elif user.groups.filter(name='Teacher').exists():
                return redirect('/teacher-dashboard/')
            else:
                return redirect('/student-dashboard/')
        else:
            messages.error(request, 'Invalid email or password')
            return redirect('/')
    return redirect('/')