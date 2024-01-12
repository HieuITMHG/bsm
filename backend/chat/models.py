from django.db import models
from django.conf import settings

# Create your models here.
from core.models import User 

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ManyToManyField(User, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content

class GroupChat(models.Model):
    groupType = models.CharField(max_length=20, null = True)
    participants = models.ManyToManyField(User, blank=True)
    groupName = models.CharField(max_length=100)
    messages = models.ManyToManyField('Message', blank=True)

    def __str__(self):
        return self.groupName

class Notification(models.Model):
    post_id =  models.IntegerField(blank = True, null = True)
    receiver = models.ManyToManyField(User, blank=True, related_name='received_notification')
    groupChat = models.ForeignKey('GroupChat', on_delete =  models.CASCADE, related_name = 'sent_notification')
    content = models.CharField(max_length = 100)
    sender = models.ForeignKey(User, on_delete = models.CASCADE)
    is_seen = models.BooleanField(default = False)
    timestamp = models.DateTimeField(auto_now_add = True) 

    def __str__(self):
         return self.timestamp.strftime('%H:%M %d/%m/%Y')
    
class MessageMedia(models.Model):
    message = models.ForeignKey('Message', related_name='messageMedia', on_delete=models.CASCADE, blank=True, null=True)
    file = models.FileField()

    def __str__(self):
        return f"{self.id} : {self.file.url}"