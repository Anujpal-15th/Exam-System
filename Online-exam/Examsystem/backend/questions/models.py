from django.db import models
from django.conf import settings

# Create your models here.

class Subject(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Question(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=500)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.text