from django.db import models
from App.models import product_model
# Create your models here.
class Cart_model(models.Model):
    cart_id=models.CharField(max_length=300)
    date_Added=models.DateTimeField(auto_now_add=True)


class Cart_item_model(models.Model):
    cart_product=models.ForeignKey(product_model,on_delete=models.CASCADE)
    cart=models.ForeignKey(Cart_model,on_delete=models.CASCADE)
    quantity=models.IntegerField()
    is_avillable=models.BooleanField(default=1)

    def sub_total(self):
        return self.quantity*self.cart_product.price