# chat/urls.py
from django.urls import path

from chat import views

urlpatterns = [
    path('messages/<int:receiverId>/', views.MessageView.as_view(), name='messages' ),
    path('groupchats/',views.GroupChatView.as_view(), name="groupchats"),
    path('singlegroupchat/<str:groupName>/', views.SingleChatView.as_view(), name="singlegroupchat"),
    path('notification/', views.NotificationView.as_view(), name = "notification"),
    path('is_seen/<int:notification_id>', views.Is_Seen_Notification.as_view(), name="is_seen"),
    path('message/', views.SendMessageView.as_view(), name="message")
]