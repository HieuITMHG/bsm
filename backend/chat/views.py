from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from chat.models import Message
from chat.serializer import MessageSerializer
from core.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

class MessageView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, receiverId):
        receiver = User.objects.get(pk = receiverId)
        combined_query = (
            Q(sender=request.user, receiver=receiverId) | 
            Q(sender=receiverId, receiver=request.user)
        )

        queryset = Message.objects.filter(combined_query).order_by('timestamp')

        serializer= MessageSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
        

        
        