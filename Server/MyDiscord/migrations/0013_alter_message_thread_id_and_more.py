# Generated by Django 4.1 on 2024-05-15 20:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MyDiscord', '0012_alter_message_thread_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='thread_id',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='thread',
            name='initial_message_id',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
