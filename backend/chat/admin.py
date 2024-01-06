from django.contrib import admin

# Register your models here.
from chat.models import Message, GroupChat

admin.site.register(Message)
admin.site.register(GroupChat)