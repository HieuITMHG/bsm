# trong file routing.py
from django.urls import path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    path('ws/notification/<int:sender_id>/<int:receiver_id>/', NotificationConsumer.as_asgi()),
]