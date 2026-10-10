from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from .models import Transaction
from .serializers import TransactionSerializer
from accounts.models import User


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

   

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)

        month = self.request.query_params.get("month")

        if month:
            try:
                year, month_number = map(int, month.split("-"))

                queryset = queryset.filter(date__year=year, date__month=month_number)
            except (ValueError, TypeError):
                pass

        return queryset.order_by("-date", "created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        user_transaction = self.get_queryset()
        income_data = user_transaction.filter(type="Income").aggregate(Sum("amount"))
        expense_data = user_transaction.filter(type="Expense").aggregate(Sum("amount"))

        total_income = income_data["amount__sum"] or 0
        total_expense = expense_data["amount__sum"] or 0
        remainig_balance = total_income - total_expense

        categories = (
            user_transaction.filter(type="Expense")
            .values("category")
            .annotate(total=Sum("amount"))
        )

        category_breakdown = []
        for cat in categories:
            percentage = (
                (cat["total"] / total_expense * 100) if total_expense > 0 else 0
            )
            category_breakdown.append(
                {
                    "category": cat["category"],
                    "total": cat["total"],
                    "percentage": round(percentage, 1),
                }
            )

        return Response(
            {
                "total_income": total_income,
                "total_expense": total_expense,
                "remaining_balance": remainig_balance,
                "category_breakdown": category_breakdown,
            },
            status=status.HTTP_200_OK,
        )


class AdminDashboardViewSet(viewsets.ViewSet):
    permission_classes = [
        permissions.IsAdminUser
    ]  # Sirf superuser/staff access kar payenge

    @action(detail=False, methods=["get"])
    def system_summary(self, request):
        total_users = User.objects.count()
        total_transactions = Transaction.objects.count()
        total_volume = Transaction.objects.aggregate(Sum("amount"))["amount__sum"] or 0

        users_list = []
        users = User.objects.all()[:20]  # Top 20 users

        for u in users:
            income = (
                Transaction.objects.filter(user=u, type="Income").aggregate(
                    Sum("amount")
                )["amount__sum"]
                or 0
            )
            expense = (
                Transaction.objects.filter(user=u, type="Expense").aggregate(
                    Sum("amount")
                )["amount__sum"]
                or 0
            )
            users_list.append(
                {
                    "id": u.id,
                    "username": u.username,
                    "email": u.email,
                    "total_income": income,
                    "total_expense": expense,
                    "is_active": u.is_active,
                }
            )

        return Response(
            {
                "total_users": total_users,
                "total_transactions": total_transactions,
                "total_volume": total_volume,
                "users": users_list,
            },
            status=status.HTTP_200_OK,
        )
