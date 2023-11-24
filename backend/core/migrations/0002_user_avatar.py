# Generated by Django 4.2.5 on 2023-10-25 11:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ForeignKey(blank=True, default=44, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_avatar', to='core.media'),
        ),
    ]
