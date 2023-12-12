from django.urls import path
from core import views
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'users', views.PeopleView, basename='users')
router.register(r'post', views.SinglePost, basename='post')

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='token_register'),
    path('login/', views.LoginView.as_view(), name='token_obtain_pair'),
    path('logout/', views.LogoutView.as_view(), name='token_logout'),
    path('user/', views.UserView.as_view(), name="user"),
    path('posts/', views.PostView.as_view(), name='posts'),
    path('follow/', views.Follow.as_view(), name='follow'),
    path('unfollow/', views.Unfollow.as_view(), name='unfollow'),
    path('ppost/<int:userid>/', views.PersonnalPostView.as_view(), name='ppost'),
    path('following/', views.FollowingPosts.as_view(), name="following_post"),
    path('updateavatar/', views.UpdateAvatar.as_view(), name="updateavatar"),
    path('like/', views.Like.as_view(), name="like"),
    path('unlike/', views.Unlike.as_view(), name="unlike"),
    path('bio/', views.BioView.as_view(), name="bio"),
    path('comment/', views.CommentView.as_view(), name="comment"),
    path('posts/<int:pk>/', views.PostView.as_view(), name='updatePost'),
    path('addfriend/',  views.Addfriend.as_view(), name = 'addfriend'),
    path('unfriend/', views.Unfriend.as_view(), name = 'unfriend'),
    path('following/<int:userid>/', views.followingView.as_view(), name='following'),
    path('follower/<int:userid>/', views.followerView.as_view(), name='follower')
]+router.urls