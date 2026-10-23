from . models import Cart_item_model,Cart_model
from . views import _cart_id

def cart_count(request):
      cart=Cart_model.objects.get(cart_id=_cart_id(request))
      cart_item=Cart_item_model.objects.filter(cart=cart,is_avillable=True)
      pc=sum(i.quantity for i in cart_item)

      return dict(pc=pc)