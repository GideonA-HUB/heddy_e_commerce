"""
Serializers for training app.
"""
from rest_framework import serializers
from .models import TrainingPackage, TrainingEnquiry


class TrainingPackageSerializer(serializers.ModelSerializer):
    """Serializer for training packages."""
    image_url = serializers.SerializerMethodField()
    package_type_display = serializers.CharField(source='get_package_type_display', read_only=True)
    features = serializers.SerializerMethodField()
    theory_topics = serializers.SerializerMethodField()
    
    class Meta:
        model = TrainingPackage
        fields = [
            'id', 'package_type', 'package_type_display', 'title', 'slug', 'description',
            'price', 'is_for_beginners', 'is_advanced', 'is_upgrade', 'is_housewife',
            'features', 'includes_theory', 'theory_topics', 'includes_pastries',
            'includes_baking', 'includes_local_dishes', 'includes_intercontinental',
            'includes_advanced_cooking', 'includes_upscale_dining', 'includes_event_catering',
            'includes_management', 'includes_general_kitchen_mgmt', 'includes_popular_african_menu',
            'includes_certification', 'is_active', 'display_order', 'image', 'image_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'image_url', 'features', 'theory_topics']
    
    def get_features(self, obj):
        """Normalize features to always return an array."""
        if not obj.features:
            return []
        
        # If it's already an array, return it
        if isinstance(obj.features, list):
            return obj.features
        
        # If it's an object, try to extract the array
        if isinstance(obj.features, dict):
            # Check for {"features": [...]} format
            if 'features' in obj.features and isinstance(obj.features['features'], list):
                return obj.features['features']
            # Check for any array value in the object
            for value in obj.features.values():
                if isinstance(value, list):
                    return value
        
        return []
    
    def get_theory_topics(self, obj):
        """Normalize theory_topics to always return an array."""
        if not obj.theory_topics:
            return []
        
        # If it's already an array, return it
        if isinstance(obj.theory_topics, list):
            return obj.theory_topics
        
        # If it's an object, try to extract the array
        if isinstance(obj.theory_topics, dict):
            # Check for {"theory_topics": [...]} format
            if 'theory_topics' in obj.theory_topics and isinstance(obj.theory_topics['theory_topics'], list):
                return obj.theory_topics['theory_topics']
            # Check for any array value in the object
            for value in obj.theory_topics.values():
                if isinstance(value, list):
                    return value
        
        return []
    
    def get_image_url(self, obj):
        """Get absolute URL for package image."""
        request = self.context.get('request')
        if obj.image and request:
            url = obj.image.url
            if url.startswith('http://') or url.startswith('https://'):
                return url
            return request.build_absolute_uri(url)
        return None


class TrainingEnquirySerializer(serializers.ModelSerializer):
    """Serializer for training enquiries."""
    package_title = serializers.CharField(source='package.title', read_only=True)
    
    class Meta:
        model = TrainingEnquiry
        fields = [
            'id', 'package', 'package_title', 'name', 'email', 'phone',
            'message', 'wants_to_learn', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        """Create a new training enquiry."""
        return TrainingEnquiry.objects.create(**validated_data)

