# Generated by Django 4.2.5 on 2024-01-10 09:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0005_groupchat_grouptype_notification'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='receiver',
            field=models.ManyToManyField(blank=True, related_name='received_notification', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='notification',
            name='groupChat',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_notification', to='chat.groupchat'),
        ),
    ]
