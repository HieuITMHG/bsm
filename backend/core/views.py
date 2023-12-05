from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer, PostSerializer, FollowSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status,permissions
from core.models import User, Post, Media
from rest_framework.parsers import MultiPartParser, FormParser
import os
from django.conf import settings
import base64
from django.core.files.base import ContentFile
import random
import string


def generate_random_string(length):
    return ''.join(random.choice(string.ascii_letters) for _ in range(length))

class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid username or password'}, status=401)


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh_token')

        try:
            RefreshToken(refresh_token).blacklist()
            return Response({'message': 'Successfully logged out.'}, status=200)
        except Exception as e:
            return Response({'error': 'Invalid refresh token'}, status=400)
        
class UserView(APIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serialized_user = self.serializer_class(user)
        return Response(serialized_user.data)
    
class PeopleView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class PostView(APIView):
    def get(self, request):
        posts = Post.objects.all().order_by('-created_at').exclude(is_comment = True)
        serialized_posts = PostSerializer(posts, many=True)  
        return Response(serialized_posts.data, status=status.HTTP_200_OK)
    def post(self, request):
        caption = request.data.get('caption')
        media_files = request.FILES.getlist('media')
        # Tạo bài đăng
        post = Post.objects.create(creater=request.user, caption=caption)

        for media_file in media_files:
            print(media_file)
            media = Media.objects.create(post=post, file=media_file)
            media.save()

        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request, pk):
        print("jhkahdka")
        ob = Post.objects.get(pk = pk)
        ob.delete()

        return Response(status=status.HTTP_200_OK)
    def patch(self, request, pk):
        parser_classes = [MultiPartParser, FormParser]
        ob = Post.objects.get(pk = pk)
        print(ob)
        print(request.data)
        serializer = PostSerializer(ob, data= request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status= status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        

    
class SinglePost(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    
class Follow(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = FollowSerializer(data=request.data)
        if serializer.is_valid():
            id = serializer.validated_data['id']
            followed_user = User.objects.get(pk = id)
            follower = request.user
            if followed_user != follower:
                follower.follow.add(followed_user)
                follower.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Unfollow(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = FollowSerializer(data=request.data)
        if  serializer.is_valid():
            id = serializer.validated_data['id']
            followed_user = User.objects.get(pk = id)
            follower = request.user
            if followed_user != follower:
                follower.follow.remove(followed_user)
                follower.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PersonnalPostView(APIView):
    def get(self, request, userid):
        creater = User.objects.get(pk = userid)
        posts = Post.objects.filter(creater = creater).exclude(is_comment= True)
        serializer = PostSerializer(posts, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class FollowingPosts(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user
        followings = current_user.follow.all()
        posts = []

        for following in followings:
            posts.extend(following.posts.all().exclude(is_comment= True))

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UpdateAvatar(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            code = request.data.get('code')
            if code is not None:
                format, imgstr = code.split(';base64,')
                ext = format.split('/')[-1]
                data = base64.b64decode(imgstr)
                ingre = generate_random_string(20)
                # Save the file in the media folder
                file_name = os.path.join(settings.MEDIA_ROOT, f'{ingre}.{ext}')
                with open(file_name, 'wb') as f:
                    f.write(data)

                # Create a new Media instance and save it
                media_instance = Media(file=f'{ingre}.{ext}')
                media_instance.save()

                # Assuming you have a ForeignKey 'avatar' in your User model
                request.user.avatar = media_instance
                request.user.save()

                return Response({"message": "Code received successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Missing 'code' in request data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Like(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        post_id = request.data.get("post_id")
        print(f"haha {post_id}")
        liked_post = Post.objects.get(pk = post_id)
        liker = request.user

        liked_post.liker.add(liker)
        liked_post.save()
        serializer = PostSerializer(liked_post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class Unlike(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        post_id = request.data.get("post_id")
        print(f"huhu {post_id}")
        liked_post = Post.objects.get(pk = post_id)
        liker = request.user

        liked_post.liker.remove(liker)
        liked_post.save()
        serializer = PostSerializer(liked_post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class BioView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        bio = request.data.get("bio")

        if bio is not None:
            request.user.aboutme = bio
            request.user.save()
            return Response({"updated"}, status= status.HTTP_200_OK)
        else:
            return Response({"error": "Bio data is missing"}, status=status.HTTP_400_BAD_REQUEST)

            
class CommentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        caption = request.data.get('caption')
        media_files = request.FILES.getlist('media')
        parent_post_id = request.data.get('parent_id')
        parent_post = Post.objects.get(pk = parent_post_id)
        post = Post.objects.create(creater=request.user, caption=caption, is_comment = True, parent_post = parent_post)

        for media_file in media_files:
            print(media_file)
            media = Media.objects.create(post=post, file=media_file)
            media.save()

        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class Addfriend(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        aims_id =  request.data.get("aims_id")
        target = User.objects.get(pk = aims_id)
        user = request.user
        user.addfriend.add(target)

        se_target = UserSerializer(target)
        addfriend_list = se_target.data.get('addfriend', [])

        print("dfjldsf")
        print(addfriend_list)
        print("dfdhf")

        if user.id in addfriend_list:
            user.friends.add(target)
            target.friends.add(user)

            user.save()
            target.save()
            return Response({"successful"}, status=status.HTTP_200_OK)
        elif user not in addfriend_list:
            user.save()
            return Response({"successful"}, status=status.HTTP_200_OK)
        
        return Response({"fail"}, status= status.HTTP_400_BAD_REQUEST)

class Unfriend(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        aims_id =  request.data.get("aims_id")
        target = User.objects.get(pk = aims_id)
        user = request.user

        se_target = UserSerializer(target)
        addfriend_list = se_target.data.get('addfriend', [])

        print("dfjldsf")
        print(addfriend_list)
        print("dfdhf")

        if user.id in addfriend_list:
            target.friends.remove(user)
            user.friends.remove(target)
            target.addfriend.remove(user)
            user.addfriend.remove(target)

            user.save()
            target.save()
            return Response({"ketket" : False}, status=status.HTTP_200_OK)
        elif user not in addfriend_list:
            user.addfriend.remove(target)
            user.save()
            return Response({"ketket" : False}, status=status.HTTP_200_OK)
        
        return Response({"fail"}, status=status.HTTP_400_BAD_REQUEST)
