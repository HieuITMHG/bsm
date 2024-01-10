from django.contrib import admin

# Register your models here.
from chat.models import Message, GroupChat, Notification

admin.site.register(Message)
admin.site.register(GroupChat)
admin.site.register(Notification)