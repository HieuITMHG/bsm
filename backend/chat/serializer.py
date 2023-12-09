from rest_framework import serializers
from core.serializers import UserSerializer
from chat.models import Message

class MessageSerializer(serializers.ModelSerializer):
    receiver = UserSerializer(read_only = True)
    sender = UserSerializer(read_only = True)
    class Meta:
        model = Message
        fields = ['id', 'content', 'receiver', 'sender', 'timestamp']