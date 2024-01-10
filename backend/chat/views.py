from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from chat.models import Message, GroupChat, Notification
from chat.serializer import MessageSerializer, GroupChatSerializer, NotificationSerializer
from core.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

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
        serializer  = GroupChatSerializer(groupChat)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class NotificationView(APIView):
    def get(self, request):
        notification = request.user.received_notification.all()
        print(notification)
        serializer = NotificationSerializer(notification, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)



    
        

        
        