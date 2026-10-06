from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSeializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('id','first_name','last_name','username','email','password','phone','gender',)

    def create(self, validate_data):
        user = User.objects.create_user(
            username = validate_data['username'],
            first_name = validate_data['first_name'],
            last_name = validate_data['last_name'],
            email  = validate_data['email'],
            password = validate_data['password'],
            phone = validate_data['phone'],
            gender=validate_data['gender'],

        )
        return user


class UserProfileSeralizer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = User
        fields = ('id','username', 'first_name','last_name','email','phone','gender','profile_image')