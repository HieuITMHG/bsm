from rest_framework import serializers
from core.serializers import UserSerializer
from chat.models import Message, GroupChat, Notification

class MessageSerializer(serializers.ModelSerializer):
    receiver = UserSerializer(many=True, read_only=True)
    sender = UserSerializer(read_only = True)
    class Meta:
        model = Message
        fields = ['id', 'content', 'receiver', 'sender', 'timestamp']


class GroupChatSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many = True, read_only = True)
    messages = MessageSerializer(many = True, read_only = True)
    class Meta:
        model = GroupChat
        fields = ['id', 'messages', 'groupName', 'participants']

class NotificationSerializer(serializers.ModelSerializer):
    groupChat = GroupChatSerializer(read_only = True)
    sender = UserSerializer(read_only = True)
    receiver = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Notification
        fields = ['id', 'groupChat', 'sender', 'content', 'timestamp', 'is_seen', 'receiver']