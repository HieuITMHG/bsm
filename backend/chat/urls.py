# chat/urls.py
from django.urls import path

from chat import views

urlpatterns = [
    path('messages/<int:receiverId>/', views.MessageView.as_view(), name='messages' ),
    path('groupchats/',views.GroupChatView.as_view(), name="groupchats"),
    path('singlegroupchat/<str:groupName>/', views.SingleChatView.as_view(), name="singlegroupchat")
]