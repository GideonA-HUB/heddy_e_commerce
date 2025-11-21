from django.contrib import admin
from .models import Payment, PaystackWebhook


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
	list_display = ['id', 'order', 'amount', 'status', 'gateway', 'reference', 'created_at']
	list_filter = ['status', 'gateway', 'created_at']
	search_fields = ['order__order_number', 'reference']
	readonly_fields = ['created_at', 'completed_at', 'reference', 'gateway_response']
	fieldsets = (
		('Payment Info', {
			'fields': ('order', 'user', 'amount', 'currency', 'gateway')
		}),
		('Transaction', {
			'fields': ('reference', 'status', 'gateway_response')
		}),
		('Timestamps', {
			'fields': ('created_at', 'completed_at')
		}),
	)


@admin.register(PaystackWebhook)
class PaystackWebhookAdmin(admin.ModelAdmin):
	list_display = ['id', 'event', 'reference', 'status', 'processed', 'created_at']
	list_filter = ['event', 'status', 'processed', 'created_at']
	search_fields = ['reference', 'event']
	readonly_fields = ['created_at', 'data']
	fieldsets = (
		('Webhook Info', {
			'fields': ('event', 'reference', 'status')
		}),
		('Data', {
			'fields': ('data',)
		}),
		('Status', {
			'fields': ('processed', 'created_at')
		}),
	)