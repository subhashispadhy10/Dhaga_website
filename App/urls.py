from django.urls import path
from Dynamic_Ecom import views
urlpatterns=[
    path('',views.shop,name='shop'),
    path('category/<slug:category_slug>/',views.shop,name='category_slug'),
    # path('product_details/',views.product_details,name='product_details'),
    path('category/<slug:category>/<slug:product_slug>/',views.product_details,name='product_details'),
    
    
    
    

]