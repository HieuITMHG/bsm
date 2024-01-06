# trong file consumers.py
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from chat.models import Message, GroupChat
from core.models import User 
from chat.serializer import MessageSerializer
from django.db.models import Q

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']

        group_list = GroupChat.objects.filter(participants = self.user.id)

        for group in group_list:
            async_to_sync(self.channel_layer.group_add)(
                group.groupName,
                self.channel_name
            )

        self.accept()

    
    def disconnect(self, close_code):

        group_list = GroupChat.objects.filter(participants = self.user.id)

        for group in group_list:
            async_to_sync(self.channel_layer.group_discard)(
                group.groupName,
                self.channel_name
            )


    def receive(self, text_data):
        print("BIG FAN SIR")
        data_json = json.loads(text_data)
        type = data_json['type']
        if type == "chat_message":       
            content = data_json['content']    
            receiver_id = data_json['receiver_id']    
            print(content)
            print(receiver_id)
            receiver = User.objects.get(pk=receiver_id)
            print("got receiver")

            message = Message.objects.create(
                sender = self.user,
                content = content
            )
            message.receiver.add(receiver)
            message.save()

            serializer_data  = MessageSerializer(message).data
            
            subname =  ""
            if self.user.id < receiver.id:
                subname =  f"{self.user.id}_{receiver.id}"
            else:
                subname = f"{receiver.id}_{self.user.id}"
            groupName = f"group_name_{subname}"

            groupChat = GroupChat.objects.get(groupName = groupName)

            groupChat.messages.add(message)

            groupChat.save()
            
            async_to_sync(self.channel_layer.group_send)(
                groupChat.groupName,
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
        elif type == "delete":
            message_id = data_json['message_id']
            message = Message.objects.get(pk = message_id)
            message.delete()
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    'type': type,
                    'message_id': message_id
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
    
    def delete(self, event):
        message_id = event['message_id']
        self.send(text_data=json.dumps({
            'message_id' : message_id,
            'type': 'delete'
        }))