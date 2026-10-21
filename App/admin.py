from django.contrib import admin
from . models import *
# Register your models here.

@admin.register(Category_model)
class category_Admin(admin.ModelAdmin):
    list_display=['id','category_name','description']
    prepopulated_fields={'slug':('category_name',)}

@admin.register(product_model)
class Product_Admin(admin.ModelAdmin):
    list_display=['id','name','price','stock','category','is_avillable']
    prepopulated_fields={'slug':('name',)}
