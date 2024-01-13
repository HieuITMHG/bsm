# trong file consumers.py
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from chat.models import Message, GroupChat, Notification
from core.models import User 
from chat.serializer import MessageSerializer, NotificationSerializer
from django.db.models import Q

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']

        user = User.objects.get(pk = self.user.id)
        user.online_status = True
        user.save()

        group_list = GroupChat.objects.filter(participants = self.user.id)

        for group in group_list:
            async_to_sync(self.channel_layer.group_add)(
                group.groupName,
                self.channel_name
            )

            async_to_sync(self.channel_layer.group_send)(
                group.groupName,
                {
                    'type' : 'online_status',
                    'online_status': True,
                    'onliner_id':self.user.id
                }
            )

        self.accept()

    
    def disconnect(self, close_code):

        user = User.objects.get(pk = self.user.id)
        user.online_status = False
        user.save()

        group_list = GroupChat.objects.filter(participants = self.user.id)

        for group in group_list:
            async_to_sync(self.channel_layer.group_send)(
                group.groupName,
                {
                    'type' : 'online_status',
                    'online_status': False,
                    'onliner_id':self.user.id
                }
            )

            async_to_sync(self.channel_layer.group_discard)(
                group.groupName,
                self.channel_name
            )


    def receive(self, text_data):
    
        data_json = json.loads(text_data)
        type = data_json['type']     
        if type == "update":
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
            receiver_id = data_json['a'] 

            message = Message.objects.get(pk = message_id)
            message.delete()

            subname =  ""
            if self.user.id < receiver_id:
                subname =  f"{self.user.id}_{receiver_id}"
            else:
                subname = f"{receiver_id}_{self.user.id}"
            groupName = f"group_name_{subname}"

            async_to_sync(self.channel_layer.group_send)(
                groupName,
                {
                    'type': type,
                    'message_id': message_id
                }
            )

            


    def chat_message(self, event):
       
        content = event['content']
        group = event['group']
        self.send(text_data=json.dumps({
            'content' : content,
            'type' : 'chat_message',
            'group' : group
        }))

    def update(self,event):
       
        typing_status = event['typing_status']
        who = event['who']
        self.send(text_data=json.dumps({
            'type' : 'update',
            'typing_status' : typing_status,
            'who' : who
        }))

    def online_status(self, event):
       
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

    def notification(self, event):
        
        notification = event['notification']
        post_id = event['post_id']
        self.send(text_data=json.dumps({
            'type' : "notification",
            'notification' : notification,
            'post_id' : post_id
        }))