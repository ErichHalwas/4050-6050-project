# Generated by Django 5.2 on 2025-04-18 23:09

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_event_info_attending_event_info_room_num_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event_info',
            old_name='attending',
            new_name='attendees',
        ),
        migrations.RemoveField(
            model_name='event_info',
            name='date',
        ),
        migrations.RemoveField(
            model_name='event_info',
            name='room_num',
        ),
        migrations.AlterField(
            model_name='event_info',
            name='city',
            field=models.CharField(default='', max_length=128),
        ),
        migrations.AlterField(
            model_name='event_info',
            name='description',
            field=models.CharField(default='', max_length=512),
        ),
        migrations.AlterField(
            model_name='event_info',
            name='end_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='event_info',
            name='host',
            field=models.CharField(default='', max_length=128),
        ),
        migrations.AlterField(
            model_name='event_info',
            name='latitude',
            field=models.CharField(default='', max_length=16),
        ),
        migrations.AlterField(
            model_name='event_info',
            name='longitude',
            field=models.CharField(default='', max_length=16),
        ),
        migrations.AlterField(
            model_name='event_info',
            name='start_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='event_info',
            name='state',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AlterField(
            model_name='event_info',
            name='street',
            field=models.CharField(default='', max_length=256),
        ),
        migrations.AlterField(
            model_name='event_info',
            name='time_zone',
            field=models.CharField(default='US/Eastern', max_length=64),
        ),
        migrations.AlterField(
            model_name='event_info',
            name='title',
            field=models.CharField(default='', max_length=128),
        ),
        migrations.AlterField(
            model_name='event_info',
            name='url',
            field=models.CharField(default='', max_length=256),
        ),
        migrations.AlterField(
            model_name='user_info',
            name='email',
            field=models.CharField(max_length=128),
        ),
        migrations.AlterField(
            model_name='user_info',
            name='password',
            field=models.CharField(max_length=64),
        ),
        migrations.AlterField(
            model_name='user_info',
            name='username',
            field=models.CharField(max_length=48),
        ),
    ]
