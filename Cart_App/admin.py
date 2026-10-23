from django.contrib import admin

# Register your models here.
from . models import *

@admin.register(Cart_model)
class cart_id_Admin(admin.ModelAdmin):
    list_display=['id','cart_id','date_Added']


@admin.register(Cart_item_model)
class Cart_item_admin(admin.ModelAdmin):
    list_display=['id','cart_product','cart','quantity','is_avillable']