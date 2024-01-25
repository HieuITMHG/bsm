from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    follow = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='followed_by')
    addfriend = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='addfriend_by')
    friends = models.ManyToManyField('self', blank=True)
    avatar = models.ForeignKey('Media', blank=True, null=True, on_delete=models.CASCADE, related_name='post_avatar')
    aboutme = models.CharField(max_length=100, default="About me", blank=True)
    online_status = models.BooleanField(default = False)
    def __str__(self):
        return self.username
    
class Post(models.Model):
    liker = models.ManyToManyField('User', blank=True, related_name="liked_posts")
    creater = models.ForeignKey('User', on_delete=models.CASCADE, related_name="posts")
    caption = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    parent_post = models.ForeignKey('self', related_name="comments", on_delete=models.CASCADE, blank=True, null=True)
    is_comment = models.BooleanField(default=False)

    def __str__(self):
        return self.caption
    
class Media(models.Model):
    post = models.ForeignKey('Post', related_name='media', on_delete=models.CASCADE, blank=True, null=True)
    file = models.FileField()

    def __str__(self):
        return f"{self.id} : {self.file.url}"
    
