from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('id','first_name','last_name','username','email','password','phone','gender',)

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            email  = validated_data['email'],
            password = validated_data['password'],
            phone = validated_data['phone'],
            gender=validated_data['gender'],

        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = User
        fields = ('id','username', 'first_name','last_name','email','phone','gender','profile_image')