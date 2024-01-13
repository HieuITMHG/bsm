from rest_framework import serializers
from core.models import User, Post, Media
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password as django_validate_password


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'file', 'post']


class FriendSerializer(serializers.ModelSerializer):
    avatar = MediaSerializer(read_only=True)
    class Meta:
        model = User  
        fields = ['id', 'username', 'email', 'avatar','online_status']  

class UserSerializer(serializers.ModelSerializer):
    avatar = MediaSerializer(read_only=True)
    email = serializers.EmailField(write_only=True)
    followed_by = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    friends = FriendSerializer(read_only = True, many = True)
    addfriend_by = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    addfriend = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email','password', 'follow', 'followed_by', 'avatar', 'aboutme', 'friends', 'addfriend_by', 'addfriend', 'online_status']

        extra_kwargs = {
            'password' : {'write_only' : True},
        }

    def validate_email(self, value):
    
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format.")

        # Check if the email is already in use
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")

        return value
    
    def validate_password(self, value):
     
        try:
            django_validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))

        # Additional custom password criteria (e.g., minimum length, must contain letters and digits)
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")

        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError("Password must contain at least one letter.")

        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one digit.")

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


