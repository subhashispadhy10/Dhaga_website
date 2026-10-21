from django.shortcuts import render,redirect
from django.http import HttpResponse
# Create your views here.


def cart(request):
    return render(request,"cart.html")
