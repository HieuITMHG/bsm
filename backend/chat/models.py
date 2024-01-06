from django.db import models
from django.conf import settings

# Create your models here.
from core.models import User 

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ManyToManyField(User, related_name='received_messages')
    content = models.CharField(max_length=200, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content

class GroupChat(models.Model):
    participants = models.ManyToManyField(User, blank=True)
    groupName = models.CharField(max_length=100)
    messages = models.ManyToManyField('Message', blank=True)

    def __str__(self):
        return self.groupName
