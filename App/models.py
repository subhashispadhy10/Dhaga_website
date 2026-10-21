from django.db import models

# Create your models here.
class Category_model(models.Model):
    category_name=models.CharField(max_length=100)
    slug=models.SlugField(max_length=100,unique=True)
    description=models.TextField()

    def __str__(self):
        return self.category_name
class product_model(models.Model):
    name=models.CharField(max_length=100)
    slug=models.SlugField(max_length=100,unique=True)
    description=models.TextField()
    image=models.ImageField(upload_to='media/product_image/')
    price=models.IntegerField(default=0)
    stock=models.IntegerField(default=0)
    category=models.ForeignKey(Category_model,on_delete=models.CASCADE)
    is_avillable=models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
    