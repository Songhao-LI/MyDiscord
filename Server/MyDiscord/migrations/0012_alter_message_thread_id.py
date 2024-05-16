# Generated by Django 4.1 on 2024-05-15 19:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('MyDiscord', '0011_alter_message_author_id_alter_message_thread_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='thread_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='MyDiscord.thread'),
        ),
    ]