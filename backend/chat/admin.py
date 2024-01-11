from django.contrib import admin

# Register your models here.
from chat.models import Message, GroupChat, Notification, MessageMedia

admin.site.register(GroupChat)
admin.site.register(Notification)
admin.site.register(MessageMedia)

class MessageMediaInline(admin.TabularInline):
    model = MessageMedia

@admin.register(Message)
class PostAdmin(admin.ModelAdmin):
    inlines = [MessageMediaInline]
    list_display = ('content', 'sender', 'timestamp')