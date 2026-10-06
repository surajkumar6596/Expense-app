from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class GENDER(models.TextChoices):
        MALE= 'male', 'Male'
        FEMALE = 'female', 'Female'
        OTHER = 'other', 'Other'

    phone = models.CharField(max_length=10, unique=True)
    gender = models.CharField(null=True,blank=True, choices=GENDER, max_length=10)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)

    def __str__(self):
        return self.username
