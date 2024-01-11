from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from chat.models import Message, GroupChat, Notification, MessageMedia
from chat.serializer import MessageSerializer, GroupChatSerializer, NotificationSerializer
from core.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class MessageView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, receiverId):
        receiver = User.objects.get(pk = receiverId)
        subname =  ""
        if request.user.id < receiver.id:
            subname =  f"{request.user.id}_{receiver.id}"
        else:
            subname = f"{receiver.id}_{request.user.id}"
        groupName = f"group_name_{subname}"
        groupChat = GroupChat.objects.get(groupName = groupName)

        queryset = groupChat.messages.all()

        serializer= MessageSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GroupChatView(APIView):
    def get(self, request):
        GroupChats = GroupChat.objects.filter(participants=request.user.id).exclude(groupType="group_notification")
        if not GroupChats.exists():
            return Response([], status=status.HTTP_200_OK)
        
        serializer = GroupChatSerializer(GroupChats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SingleChatView(APIView):
    def get(self, request, groupName):
        groupChat = GroupChat.objects.get(groupName = groupName)
        serializer = GroupChatSerializer(groupChat)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class NotificationView(APIView):
    def get(self, request):
        notification = request.user.received_notification.all().order_by("-timestamp")[:20]
        print(notification)
        serializer = NotificationSerializer(notification, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class Is_Seen_Notification(APIView):
    def get(sef, request, notification_id):
        notifi = Notification.objects.get(pk = notification_id)
        notifi.is_seen = True
        notifi.save()
        return Response({"is_seen has been changed"},status=status.HTTP_200_OK)
    
class SendMessageView(APIView):
    def post(self, request):
        receiver_id = request.data.get("receiver_id")
        content = request.data.get('content')
        media_files = request.FILES.getlist('media')
       
        receiver = User.objects.get(pk = receiver_id)

        message = Message.objects.create(sender=request.user, content = content)
        message.receiver.add(receiver)

        for media_file in media_files:
            print(media_file)
            media = MessageMedia.objects.create(message = message, file=media_file)
            media.save()
        groupName = ""
        if request.user.id < receiver.id:
            groupName = f"group_name_{request.user.id}_{receiver.id}"
        else:
            groupName = f"group_name_{receiver.id}_{request.user.id}"

        serializer_data = MessageSerializer(message).data

        channel = get_channel_layer()

        group = GroupChat.objects.get(groupName = groupName)
        group.messages.add(message)

        async_to_sync(channel.group_send)(
                groupName,
                {
                    'group': groupName,
                    'type': "chat_message",
                    'content': serializer_data,
                }
            )
        
        return Response({'sended message'}, status=status.HTTP_200_OK)




    
        

        
        