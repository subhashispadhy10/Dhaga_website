from django.shortcuts import render,redirect
from django.http import HttpResponse
from App.models import Category_model,product_model
from django.core.paginator import PageNotAnInteger,Paginator,EmptyPage

def Home(request):
    return render(request,"index.html")

def shop(request,category_slug=None):
    product=None
    category=Category_model.objects.all()
    cat_item=None
    if category_slug!=None:
         cat_item=Category_model.objects.get(slug=category_slug)
         product=product_model.objects.filter(category=cat_item)

    else:
        product=product_model.objects.all()
        
    context={
        'product':product,
        'category':category,
        'select_category':cat_item,

    }
    return render(request,"shop.html",context)

def product_details(request,category=None,product_slug=None):
    single_product=product_model.objects.get(category__slug=category,slug=product_slug)
    context={
        'single_product':single_product
    }
    return render(request,"product_details.html",context)
