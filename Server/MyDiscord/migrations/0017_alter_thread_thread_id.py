# Generated by Django 4.1 on 2024-05-16 01:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MyDiscord', '0016_alter_message_thread_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='thread',
            name='thread_id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]