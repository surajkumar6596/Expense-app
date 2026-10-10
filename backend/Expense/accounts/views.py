from django.shortcuts import render

# Create your views here.
from rest_framework import status,generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer,UserProfileSerializer
from rest_framework.views import APIView



User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request,*args,**kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception= True)
        user = serializer.save()

        return Response(
            {
                'message':'Registet successfully',
                'user': UserProfileSerializer(user).data
            },
            status=status.HTTP_201_CREATED

        )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status = status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        serializer = UserProfileSerializer(user, data = request.data, partial = True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data, status=status.HTTP_200_OK
            )

        print('Serializer Errors :',serializer.errors)
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)