from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from chat.models import Message, GroupChat
from chat.serializer import MessageSerializer
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
    
        

        
        