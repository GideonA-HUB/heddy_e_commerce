from django.contrib import admin
from .models import MealPlan, MealPlanSubscription


@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ['title', 'plan_type', 'period', 'price', 'is_active', 'created_at']
    list_filter = ['is_active', 'plan_type', 'period', 'created_at']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at']
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'slug', 'plan_type', 'period', 'description')
        }),
        ('Pricing', {
            'fields': ('price',)
        }),
        ('Details', {
            'fields': ('features', 'sample_pdf', 'is_customizable', 'display_order')
        }),
        ('Status', {
            'fields': ('is_active', 'created_at')
        }),
    )


@admin.register(MealPlanSubscription)
class MealPlanSubscriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'meal_plan', 'status', 'start_date', 'next_billing_date', 'created_at']
    list_filter = ['status', 'created_at', 'meal_plan']
    search_fields = ['user__username', 'user__email', 'meal_plan__title']
    readonly_fields = ['created_at']
    actions = ['pause_subscriptions', 'cancel_subscriptions', 'activate_subscriptions']
    fieldsets = (
        ('Subscription Info', {
            'fields': ('user', 'meal_plan', 'status')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date', 'next_billing_date')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )
    
    def pause_subscriptions(self, request, queryset):
        updated = queryset.update(status='paused')
        self.message_user(request, f'{updated} subscription(s) paused.')
    
    def cancel_subscriptions(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} subscription(s) cancelled.')
    
    def activate_subscriptions(self, request, queryset):
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} subscription(s) activated.')
    
    pause_subscriptions.short_description = 'Pause selected subscriptions'
    cancel_subscriptions.short_description = 'Cancel selected subscriptions'
    activate_subscriptions.short_description = 'Activate selected subscriptions'
