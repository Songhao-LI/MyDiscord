# Generated by Django 4.1 on 2024-05-11 20:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MyDiscord', '0002_thread_message'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='thread',
            new_name='thread_id',
        ),
        migrations.AddField(
            model_name='thread',
            name='initial_message',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='initiating_thread', to='MyDiscord.message'),
        ),
    ]