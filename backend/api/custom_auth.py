from rest_framework_simplejwt.authentication import JWTAuthentication

from api.models import User_Info

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access')
        if access_token:
            validated_token = self.get_validated_token(access_token)
            return self.get_user(validated_token), validated_token
        return None

    def get_user(self, validated_token):
        username = validated_token.get("user_id")
        if not username:
            return None
        try:
            return User_Info.objects.get(username=username)
        except User_Info.DoesNotExist:
            return None