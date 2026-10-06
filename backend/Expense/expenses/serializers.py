from rest_framework import serializers
from .models import Transaction



class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "title",
            "amount",
            "type",
            "category",
            "date",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_amount(self, value):
        if value <=0:
            raise serializers.ValidationError('Amount above of 0')
        return value
    


