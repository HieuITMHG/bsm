# Generated by Django 4.2.5 on 2023-12-25 05:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_user_addfriend_user_friends'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='online_status',
            field=models.BooleanField(default=False),
        ),
    ]
