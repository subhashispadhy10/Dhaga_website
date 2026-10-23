from django.shortcuts import render,redirect
from django.http import HttpResponse
from . models import Cart_model,Cart_item_model
from App.models import product_model
from django.contrib import messages

def _cart_id(request):
     cart=request.session.session_key
     if not cart:
          cart=request.session.create()
     return cart

def add_cart(request,product_id):
     product=product_model.objects.get(id=product_id)
     try:
          cart=Cart_model.objects.get(cart_id=_cart_id(request))
     except Cart_model.DoesNotExist:
          cart=Cart_model(cart_id=_cart_id(request))
          cart.save()
 #in upper part i get the cart id if there it will fetch other wise it create a new sessionid and store in cart model
     try:
          cart_item=Cart_item_model.objects.get(cart_product=product,cart=cart)
          cart_item.quantity+=1
          cart_item.save()
     except Cart_item_model.DoesNotExist:
          cart_item=Cart_item_model(cart_product=product,cart=cart)
          cart_item.quantity=1
          cart_item.save()

     return redirect('cart')
      

def cart(request):
     cart=Cart_model.objects.get(cart_id=_cart_id(request))
     cart_item=Cart_item_model.objects.filter(cart=cart,is_avillable=True)
     pc=sum(i.quantity for i in cart_item)
     total=0.0
     amount=0  
     if cart_item:
          for i in cart_item:
               amount+=i.quantity*i.cart_product.price
                
          total=40+amount
     if total >1999:
          total=total-40

     
     context={
          'cart_item':cart_item,
          'total':total,
          'amount':amount,
          'pc':pc
     }
     return render(request,"cart.html",context)

def minus_cart(request,product_id):
     cart=Cart_model.objects.get(cart_id=_cart_id(request))
     product=product_model.objects.get(id=product_id)
     cart_item=Cart_item_model.objects.get(cart=cart,cart_product=product)
     if cart_item.quantity>1:
          cart_item.quantity-=1
     cart_item.save()
     return redirect('cart')

def remove_cart(request,product_id):
     cart=Cart_model.objects.get(cart_id=_cart_id(request))
     product=product_model.objects.get(id=product_id)
     cart_item=Cart_item_model.objects.get(cart=cart,cart_product=product)
     cart_item.delete()
     return redirect('cart')