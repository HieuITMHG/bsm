# chat/urls.py
from django.urls import path

from chat import views

urlpatterns = [
    path('messages/<int:receiverId>/', views.MessageView.as_view(), name='messages' ),
]