# trong file consumers.py
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from chat.models import Message
from core.models import User 
from chat.serializer import MessageSerializer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.sender_id = self.scope['url_route']['kwargs']['sender_id']
        self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']

        onliner = User.objects.get(pk = self.sender_id)
        onliner.online_status = True
        onliner.save()

        if self.sender_id < self.receiver_id :
            self.room_name = f'{self.sender_id}_{self.receiver_id}'
        else:
            self.room_name = f'{self.receiver_id}_{self.sender_id}'

        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )

        self.accept()

        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                'type' : 'online_status',
                'online_status' :True,
                'onliner_id' : self.sender_id
            }
        )
    
    def disconnect(self, close_code):

        onliner = User.objects.get(pk = self.sender_id)
        onliner.online_status = False
        onliner.save()

        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                'type' : 'online_status',
                'online_status' :False,
                'onliner_id' : self.sender_id
            }
        )

        async_to_sync(self.channel_layer.group_discard)(
            self.room_name,
            self.channel_name
        )


    def receive(self, text_data):
        print("BIG FAN SIR")
        data_json = json.loads(text_data)
        type = data_json['type']
        if type == "chat_message":       
            content = data_json['content']        
            sender = User.objects.get(pk = self.sender_id )
            receiver = User.objects.get(pk=self.receiver_id)

            message = Message.objects.create(
                sender = sender,
                receiver = receiver,
                content = content
            )

            serializer_data  = MessageSerializer(message).data

            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    'type': type,
                    'content': serializer_data,
                }
            )
        elif type == "update":
            typing_status = data_json['typing_status']
            who = data_json['who']
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    'type': type,
                    'typing_status': typing_status,
                    'who' : who
                }
            )


    def chat_message(self, event):
        print("YOU ARE WELCOME")
        content = event['content']
        self.send(text_data=json.dumps({
            'content' : content,
            'type' : 'chat_message'
        }))

    def update(self,event):
        print("update typing status")
        typing_status = event['typing_status']
        who = event['who']
        self.send(text_data=json.dumps({
            'type' : 'update',
            'typing_status' : typing_status,
            'who' : who
        }))

    def online_status(self, event):
        print("Online Status")
        online_status = event['online_status']
        onliner_id = event['onliner_id']
        self.send(text_data=json.dumps({
            'type' : 'online_status',
            'online_status': online_status,
            'onliner_id' : onliner_id
        }))
