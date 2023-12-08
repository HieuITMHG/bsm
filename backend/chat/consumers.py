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

        if self.sender_id < self.receiver_id :
            self.room_name = f'{self.sender_id}_{self.receiver_id}'
        else:
            self.room_name = f'{self.receiver_id}_{self.sender_id}'

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
        print("BIG FAN SIR")
        data_json = json.loads(text_data)
        content = data_json['content']
        sender = User.objects.get(pk = self.sender_id )
        receiver = User.objects.get(pk=self.receiver_id)

        message = Message.objects.create(
            sender = sender,
            receiver = receiver,
            content = content
        )

        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                'type': 'chat_message',
                'content': content,
                'sender': sender.username,
                'timestamp': str(message.timestamp)
            }
        )

    def chat_message(self, event):
        print("YOU ARE WELCOME")
        message = event['content']
        sender = event['sender']
        timestamp = event['timestamp']

        self.send(text_data=json.dumps({
            'content' : message,
            'sender' : sender,
            'timestamp' : timestamp
        }))
