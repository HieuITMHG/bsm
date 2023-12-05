# trong file consumers.py
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from chat.models import Message
from core.models import User 

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.sender_id = self.scope['url_route']['kwargs']['sender_id']
        self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']

        self.room_name = f'{self.sender_id}_{self.receiver_id}'

        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )

        self.accept()
    
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name,
            self.channel_name
        )

    def receive(self, text_data):
        data_json = json.loads(text_data)
        content = data_json['content']
        sender = self.scope['user']
        receiver = User.objects.get(pk=self.receiver_id)

        message = Message.objects