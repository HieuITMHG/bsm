from rest_framework import serializers
from core.models import User, Post, Media


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'file', 'post']


class FriendSerializer(serializers.ModelSerializer):
    avatar = MediaSerializer(read_only=True)
    class Meta:
        model = User  
        fields = ['id', 'username', 'email', 'avatar']  

class UserSerializer(serializers.ModelSerializer):
    avatar = MediaSerializer(read_only=True)
    email = serializers.EmailField(write_only=True)
    followed_by = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    friends = FriendSerializer(read_only = True, many = True)
    addfriend_by = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    addfriend = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'follow', 'followed_by', 'avatar', 'aboutme', 'friends', 'addfriend_by', 'addfriend']

        extra_kwargs = {
            'password' : {'write_only' : True},
        }

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email may not be blank.")
        return value
    
    def create(self, validated_data):
        email = validated_data.pop('email', None)  
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)

        if email is not None and password is not None:
            instance.set_password(password)
            instance.email = email 

        instance.save()
        return instance
    

class RecursiveSerializer(serializers.Serializer):
    def to_representation(self, instance):
        serializer = self.parent.parent.__class__(instance, context=self.context)
        return serializer.data


class PostSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only = True)
    creater = UserSerializer(read_only=True)
    comments = RecursiveSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'creater', 'caption', 'created_at', 'media', 'liker', 'parent_post', 'is_comment', 'comments']
        read_only_fields = ['creater']

class FollowSerializer(serializers.Serializer):
    id = serializers.IntegerField()


